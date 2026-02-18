import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth/replitAuth";
import { authStorage } from "./replit_integrations/auth/storage";
import { onboardingSchema, profileUpdateSchema, validateNIP, validatePESEL } from "@shared/schema";
import { sendVerificationEmail, generateVerificationCode, hashVerificationCode, verifyCodeHash, sendContactNotificationEmail } from "./email";
import { contactFormSchema, CASE_CATEGORY_LABELS } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";
import bcrypt from "bcryptjs";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const UPLOAD_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix + ext);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Niedozwolony typ pliku. Dozwolone: PDF, JPG, PNG, DOCX"));
    }
  },
});

function getUserId(req: Request): string {
  const user = req.user as any;
  return user?.claims?.sub;
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Nie zalogowany" });
  const user = await storage.getUserById(userId);
  if (!user?.isAdmin) return res.status(403).json({ message: "Brak uprawnien administratora" });
  next();
}

async function requireLawyer(req: Request, res: Response, next: NextFunction) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: "Nie zalogowany" });
  const user = await storage.getUserById(userId);
  if (!user || (user.role !== "adwokat" && user.role !== "radca_prawny")) {
    return res.status(403).json({ message: "Dostep tylko dla prawnikow" });
  }
  next();
}

function isLawyerRole(role: string | null): boolean {
  return role === "adwokat" || role === "radca_prawny";
}

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", async (req: Request, res: Response) => {
    if ((req.session as any)?.adminUserId) {
      const user = await storage.getUserById((req.session as any).adminUserId);
      if (user) return res.json(user);
    }
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await authStorage.getUser(userId);
    if (!user) return res.status(401).json({ message: "Uzytkownik nie znaleziony" });
    res.json(user);
  });

  app.post("/api/admin-login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Podaj email i haslo" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash || !user.isAdmin) {
        return res.status(401).json({ message: "Nieprawidlowy email lub haslo" });
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Nieprawidlowy email lub haslo" });
      }
      (req.session as any).adminUserId = user.id;
      res.json({ message: "Zalogowano pomyslnie", user: { ...user, passwordHash: undefined } });
    } catch (error) {
      console.error("[Admin Login] Error:", error);
      res.status(500).json({ message: "Blad serwera" });
    }
  });

  app.post("/api/admin-logout", async (req: Request, res: Response) => {
    (req.session as any).adminUserId = undefined;
    req.session.destroy(() => {});
    res.json({ message: "Wylogowano" });
  });

  app.post("/api/admin-set-password", async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req) || (req.session as any)?.adminUserId;
      if (!userId) return res.status(401).json({ message: "Nie zalogowany" });
      const user = await storage.getUserById(userId);
      if (!user?.isAdmin) return res.status(403).json({ message: "Tylko administratorzy moga zmieniac haslo" });
      const { currentPassword, newPassword } = req.body;
      if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ message: "Haslo musi miec minimum 8 znakow" });
      }
      if (user.passwordHash) {
        if (!currentPassword) return res.status(400).json({ message: "Podaj aktualne haslo" });
        const valid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!valid) return res.status(401).json({ message: "Nieprawidlowe aktualne haslo" });
      }
      const hash = await bcrypt.hash(newPassword, 12);
      await storage.updateUserPassword(user.id, hash);
      res.json({ message: "Haslo zostalo zmienione" });
    } catch (error) {
      console.error("[Set Password] Error:", error);
      res.status(500).json({ message: "Blad serwera" });
    }
  });

  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { email, password, role, firstName, lastName, phone, street, city, postalCode, voivodeship, country, pesel, companyName, nip, barNumber } = req.body;

      if (!email || !password || !role || !firstName || !lastName) {
        return res.status(400).json({ message: "Wymagane pola: email, haslo, rola, imie, nazwisko" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Haslo musi miec minimum 8 znakow" });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Nieprawidlowy adres email" });
      }

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Konto z tym adresem email juz istnieje" });
      }

      if (nip && !validateNIP(nip)) {
        return res.status(400).json({ message: "Nieprawidlowy numer NIP" });
      }
      if (pesel && !validatePESEL(pesel)) {
        return res.status(400).json({ message: "Nieprawidlowy numer PESEL" });
      }

      const isPoland = !country || country === "Polska" || country === "PL";
      if (isPoland && postalCode && !/^\d{2}-\d{3}$/.test(postalCode)) {
        return res.status(400).json({ message: "Nieprawidlowy kod pocztowy. Format: XX-XXX" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const ADMIN_EMAILS = ["goldservicepoland@gmail.com", "grzegorzdur3@gmail.com"];

      const userData: any = {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        phone: phone || null,
        street: street || null,
        city: city || null,
        postalCode: postalCode || null,
        voivodeship: isPoland ? (voivodeship || null) : null,
        country: country || "Polska",
        onboardingCompleted: true,
        emailVerified: false,
        isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
      };

      if (role === "adwokat" || role === "radca_prawny") {
        userData.barNumber = barNumber || null;
        userData.lawyerType = role;
        userData.nip = nip || null;
      }
      if (role === "klient") {
        userData.pesel = pesel || null;
      }
      if (role === "firma") {
        userData.companyName = companyName || null;
        userData.nip = nip || null;
        userData.pesel = pesel || null;
      }

      const user = await storage.createUser(userData);
      (req.session as any).adminUserId = user.id;
      res.json({ message: "Konto utworzone pomyslnie", user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      console.error("[Register] Error:", error);
      res.status(500).json({ message: "Blad serwera" });
    }
  });

  const DISPOSABLE_DOMAINS = new Set([
    "tempmail.com","temp-mail.org","guerrillamail.com","guerrillamail.de","guerrillamail.net",
    "mailinator.com","throwaway.email","yopmail.com","10minutemail.com","trashmail.com",
    "sharklasers.com","grr.la","guerrillamailblock.com","maildrop.cc","dispostable.com",
    "fakeinbox.com","mailnesia.com","temp-mail.io","tempail.com","tempr.email",
    "binkmail.com","mytemp.email","mohmal.com","getnada.com","emailondeck.com",
    "mintemail.com","burnermail.io","inboxbear.com","mailsac.com","harakirimail.com",
    "crazymailing.com","tempinbox.com","trashmail.me","trashmail.net","mailcatch.com",
    "mailscrap.com","discard.email","discardmail.com","spamgourmet.com","mailnull.com",
    "spamfree24.org","jetable.org","trash-mail.com","mail-temporaire.fr","tempmailo.com",
    "tempomail.fr","tmpmail.net","tmpmail.org","wegwerfmail.de","wegwerfmail.net",
    "mailexpire.com","noclickemail.com","guerrillamailblock.com","spam4.me","grr.la",
    "tmail.ws","tmail.link","tempail.com","filzmail.com","ezztt.com",
    "mailforspam.com","rmqkr.net","eyepaste.com","fakemailgenerator.com","armyspy.com",
    "cuvox.de","dayrep.com","einrot.com","fleckens.hu","gustr.com",
    "jourrapide.com","rhyta.com","superrito.com","teleworm.us"
  ]);

  function isDisposableEmailServer(email: string): boolean {
    const domain = email.split("@")[1]?.toLowerCase();
    if (!domain) return false;
    return DISPOSABLE_DOMAINS.has(domain);
  }

  app.post("/api/onboarding", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const parsed = onboardingSchema.parse(req.body);

      if (isDisposableEmailServer(parsed.email)) {
        return res.status(400).json({ message: "Tymczasowe adresy email nie sa akceptowane. Uzyj stalego adresu email." });
      }

      const isPoland = !parsed.country || parsed.country === "Polska" || parsed.country === "PL";
      if (isPoland) {
        if (!/^\d{2}-\d{3}$/.test(parsed.postalCode)) {
          return res.status(400).json({ message: "Nieprawidlowy kod pocztowy. Format: XX-XXX" });
        }
        if (!parsed.voivodeship || parsed.voivodeship.trim().length === 0) {
          return res.status(400).json({ message: "Wojewodztwo jest wymagane dla adresu w Polsce" });
        }
      }

      if (parsed.nip && !validateNIP(parsed.nip)) {
        return res.status(400).json({ message: "Nieprawidlowy numer NIP" });
      }
      if (parsed.pesel && !validatePESEL(parsed.pesel)) {
        return res.status(400).json({ message: "Nieprawidlowy numer PESEL" });
      }

      const updateData: any = {
        role: parsed.role,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        email: parsed.email,
        phone: parsed.phone,
        street: parsed.street,
        city: parsed.city,
        postalCode: parsed.postalCode,
        voivodeship: parsed.voivodeship,
        country: parsed.country || "Polska",
        onboardingCompleted: true,
        emailVerified: false,
      };

      if (parsed.role === "adwokat" || parsed.role === "radca_prawny") {
        updateData.barNumber = parsed.barNumber || null;
        updateData.lawyerType = parsed.role;
        updateData.nip = parsed.nip || null;
      }

      if (parsed.role === "klient") {
        updateData.pesel = parsed.pesel || null;
        updateData.address = parsed.address || null;
      }

      if (parsed.role === "firma") {
        updateData.companyName = parsed.companyName || null;
        updateData.nip = parsed.nip || null;
        updateData.pesel = parsed.pesel || null;
        updateData.address = parsed.address || null;
      }

      const user = await storage.updateUserProfile(userId, updateData);

      const code = generateVerificationCode();
      const codeHash = hashVerificationCode(code);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await storage.createEmailVerification(userId, parsed.email, codeHash, expiresAt);

      const emailSent = await sendVerificationEmail(parsed.email, `${parsed.firstName} ${parsed.lastName}`, code);
      if (!emailSent) {
        console.warn(`[Onboarding] Email verification failed to send to ${parsed.email}, user can resend from verify page`);
      }

      res.json({ ...user, emailSent });
    } catch (error: any) {
      console.error("[Onboarding] Error:", error.message);
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/verify-email", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { code } = req.body;
      if (!code || typeof code !== "string") {
        return res.status(400).json({ message: "Kod jest wymagany" });
      }

      const verification = await storage.getActiveVerification(userId);
      if (!verification) {
        return res.status(400).json({ message: "Kod wygasl lub nie istnieje. Wyslij ponownie." });
      }

      if (verification.lockedUntil && new Date(verification.lockedUntil) > new Date()) {
        const minutesLeft = Math.ceil((new Date(verification.lockedUntil).getTime() - Date.now()) / 60000);
        return res.status(429).json({ message: `Zbyt wiele blednych prob. Sprobuj ponownie za ${minutesLeft} min.` });
      }

      if (verification.failedAttempts >= 3 && !verification.lockedUntil) {
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await storage.lockVerification(verification.id, lockUntil);
        return res.status(429).json({ message: "Zbyt wiele blednych prob. Konto zablokowane na 15 minut. Wyslij nowy kod." });
      }

      const isValid = verifyCodeHash(code.trim(), verification.code);
      if (!isValid) {
        const attempts = await storage.incrementFailedAttempts(verification.id);
        if (attempts >= 3) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
          await storage.lockVerification(verification.id, lockUntil);
          return res.status(429).json({ message: "Zbyt wiele blednych prob. Konto zablokowane na 15 minut. Wyslij nowy kod." });
        }
        const remaining = 3 - attempts;
        return res.status(400).json({ message: `Nieprawidlowy kod. Pozostalo prob: ${remaining}` });
      }

      await storage.markVerificationUsed(verification.id);
      const user = await storage.updateUserProfile(userId, { emailVerified: true });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/resend-verification", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const user = await storage.getUserById(userId);
      if (!user || !user.email) {
        return res.status(400).json({ message: "Brak adresu email" });
      }

      const recentCount = await storage.getRecentVerificationCount(userId, 15);
      if (recentCount >= 5) {
        return res.status(429).json({ message: "Zbyt wiele prosb o kod. Sprobuj ponownie za kilka minut." });
      }

      const code = generateVerificationCode();
      const codeHash = hashVerificationCode(code);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await storage.createEmailVerification(userId, user.email, codeHash, expiresAt);
      const sent = await sendVerificationEmail(user.email, `${user.firstName || ""} ${user.lastName || ""}`, code);

      if (!sent) {
        return res.status(500).json({ message: "Blad wysylki emaila" });
      }

      res.json({ message: "Kod wyslany ponownie" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/profile", isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(404).json({ message: "Uzytkownik nie znaleziony" });
    res.json(user);
  });

  app.patch("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const parsed = profileUpdateSchema.parse(req.body);
      const user = await storage.updateUserProfile(userId, parsed);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/clients", isAuthenticated, requireLawyer, async (req, res) => {
    const result = await storage.getClientRecordsByLawyer(getUserId(req));
    res.json(result);
  });

  app.post("/api/clients", isAuthenticated, requireLawyer, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { firstName, lastName, pesel, email, phone, address, city, postalCode, notes } = req.body;
      if (!firstName || !lastName) return res.status(400).json({ message: "Imie i nazwisko sa wymagane" });

      let linkedUserId = null;
      if (email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) linkedUserId = existingUser.id;
      }

      const record = await storage.createClientRecord({
        lawyerId: userId,
        userId: linkedUserId,
        firstName, lastName, pesel: pesel || null, email: email || null,
        phone: phone || null, address: address || null, city: city || null,
        postalCode: postalCode || null, notes: notes || null,
      });
      res.status(201).json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/clients/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const record = await storage.updateClientRecord(id, getUserId(req), req.body);
    if (!record) return res.status(404).json({ message: "Klient nie znaleziony" });
    res.json(record);
  });

  app.delete("/api/clients/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteClientRecord(id, getUserId(req));
    if (!deleted) return res.status(404).json({ message: "Klient nie znaleziony" });
    res.json({ message: "Klient usuniety" });
  });

  app.get("/api/cases", isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    if (isLawyerRole(user.role)) {
      const result = await storage.getCasesByLawyer(userId);
      res.json(result);
    } else {
      const result = await storage.getCasesByClient(userId);
      res.json(result);
    }
  });

  app.get("/api/cases/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    const c = await storage.getCaseById(id);
    if (!c) return res.status(404).json({ message: "Sprawa nie znaleziona" });

    if (isLawyerRole(user.role) && c.lawyerId === userId) {
      return res.json(c);
    }

    if (c.clientRecordId) {
      const records = await storage.getClientRecordsByLawyer(c.lawyerId);
      const record = records.find(r => r.id === c.clientRecordId && r.userId === userId);
      if (record) return res.json(c);
    }

    return res.status(403).json({ message: "Brak dostepu" });
  });

  app.post("/api/cases", isAuthenticated, requireLawyer, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { title, caseNumber, description, clientRecordId } = req.body;
      if (!title) return res.status(400).json({ message: "Tytul sprawy jest wymagany" });

      const c = await storage.createCase({
        lawyerId: userId,
        clientRecordId: clientRecordId || null,
        title,
        caseNumber: caseNumber || null,
        description: description || null,
        status: "active",
      });
      res.status(201).json(c);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/cases/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const c = await storage.getCaseById(id);
    if (!c || c.lawyerId !== getUserId(req)) return res.status(404).json({ message: "Sprawa nie znaleziona" });
    const updated = await storage.updateCase(id, req.body);
    res.json(updated);
  });

  app.delete("/api/cases/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteCase(id, getUserId(req));
    if (!deleted) return res.status(404).json({ message: "Sprawa nie znaleziona" });
    res.json({ message: "Sprawa usunieta" });
  });

  app.get("/api/cases/:id/messages", isAuthenticated, async (req, res) => {
    const caseId = parseInt(req.params.id);
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    const c = await storage.getCaseById(caseId);
    if (!c) return res.status(404).json({ message: "Sprawa nie znaleziona" });

    if (isLawyerRole(user.role) && c.lawyerId !== userId) {
      return res.status(403).json({ message: "Brak dostepu" });
    }

    const msgs = await storage.getDirectMessages(caseId);
    const withAttachments = await Promise.all(
      msgs.map(async (msg) => {
        const attachments = await storage.getMessageAttachments(msg.id);
        return { ...msg, attachments };
      })
    );
    res.json(withAttachments);
  });

  app.post("/api/cases/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const caseId = parseInt(req.params.id);
      const userId = getUserId(req);
      const { content } = req.body;

      if (!content?.trim()) return res.status(400).json({ message: "Tresc jest wymagana" });

      const c = await storage.getCaseById(caseId);
      if (!c) return res.status(404).json({ message: "Sprawa nie znaleziona" });

      let recipientId = c.lawyerId;
      if (userId === c.lawyerId && c.clientRecordId) {
        const clientRecord = await storage.getClientRecordById(c.clientRecordId, c.lawyerId);
        if (clientRecord?.userId) recipientId = clientRecord.userId;
      }

      const msg = await storage.createDirectMessage({
        caseId,
        senderId: userId,
        recipientId,
        content: content.trim(),
      });
      res.status(201).json(msg);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/cases/:id/messages/upload", isAuthenticated, (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
      if (!req.file) return res.status(400).json({ message: "Brak pliku" });

      const caseId = parseInt(req.params.id);
      const userId = getUserId(req);
      const { content } = req.body;

      try {
        const c = await storage.getCaseById(caseId);
        if (!c) {
          fs.unlinkSync(req.file.path);
          return res.status(404).json({ message: "Sprawa nie znaleziona" });
        }

        let recipientId = c.lawyerId;
        if (userId === c.lawyerId && c.clientRecordId) {
          const clientRecord = await storage.getClientRecordById(c.clientRecordId, c.lawyerId);
          if (clientRecord?.userId) recipientId = clientRecord.userId;
        }

        const file = await storage.createFile({
          userId,
          caseId,
          name: req.file.originalname,
          path: req.file.path,
          type: req.file.mimetype,
          size: req.file.size,
        });

        const msg = await storage.createDirectMessage({
          caseId,
          senderId: userId,
          recipientId,
          content: content || `Zalaczono plik: ${req.file.originalname}`,
        });

        const attachment = await storage.createMessageAttachment({
          messageId: msg.id,
          fileId: file.id,
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
        });

        res.status(201).json({ message: msg, attachment });
      } catch (error: any) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
      }
    });
  });

  app.patch("/api/messages/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = getUserId(req);
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: "Tresc jest wymagana" });

    const msg = await storage.updateDirectMessage(id, userId, content.trim());
    if (!msg) return res.status(404).json({ message: "Wiadomosc nie znaleziona lub brak uprawnien" });
    res.json(msg);
  });

  app.get("/api/attachments/:id/download", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    const file = await storage.getFileByIdAny(id);
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });

    if (file.userId === userId) {
      // owner
    } else if (file.caseId) {
      const c = await storage.getCaseById(file.caseId);
      if (!c) return res.status(403).json({ message: "Brak dostepu" });
      if (c.lawyerId === userId) {
        // lawyer on case
      } else if (c.clientRecordId) {
        const clientRecord = await storage.getClientRecordById(c.clientRecordId, c.lawyerId);
        if (!clientRecord || clientRecord.userId !== userId) {
          return res.status(403).json({ message: "Brak dostepu" });
        }
      } else {
        return res.status(403).json({ message: "Brak dostepu" });
      }
    } else {
      return res.status(403).json({ message: "Brak dostepu" });
    }

    if (!fs.existsSync(file.path)) return res.status(404).json({ message: "Plik nie istnieje na dysku" });
    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    fs.createReadStream(file.path).pipe(res);
  });

  app.get("/api/folders", isAuthenticated, async (req, res) => {
    const result = await storage.getFoldersByUser(getUserId(req));
    res.json(result);
  });

  app.post("/api/folders", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { name, parentFolderId, caseId } = req.body;
      if (!name || !name.trim()) return res.status(400).json({ message: "Nazwa folderu jest wymagana" });
      if (parentFolderId) {
        const parent = await storage.getFolderById(parentFolderId, userId);
        if (!parent) return res.status(404).json({ message: "Folder nadrzedny nie znaleziony" });
      }
      const folder = await storage.createFolder({ userId, name: name.trim(), parentFolderId: parentFolderId || null, caseId: caseId || null });
      res.status(201).json(folder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/folders/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Nazwa jest wymagana" });
    const folder = await storage.updateFolder(id, getUserId(req), name.trim());
    if (!folder) return res.status(404).json({ message: "Folder nie znaleziony" });
    res.json(folder);
  });

  app.delete("/api/folders/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteFolder(id, getUserId(req));
    if (!deleted) return res.status(404).json({ message: "Folder nie znaleziony" });
    res.json({ message: "Folder usuniety" });
  });

  app.get("/api/files", isAuthenticated, async (req, res) => {
    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : null;
    const result = await storage.getFilesByFolder(getUserId(req), folderId);
    res.json(result);
  });

  app.post("/api/files/upload", isAuthenticated, (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });
      if (!req.file) return res.status(400).json({ message: "Brak pliku" });
      const userId = getUserId(req);
      const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
      const caseId = req.body.caseId ? parseInt(req.body.caseId) : null;

      if (folderId) {
        const folder = await storage.getFolderById(folderId, userId);
        if (!folder) {
          fs.unlinkSync(req.file.path);
          return res.status(404).json({ message: "Folder nie znaleziony" });
        }
      }

      try {
        const file = await storage.createFile({
          userId, folderId, caseId,
          name: req.file.originalname,
          path: req.file.path,
          type: req.file.mimetype,
          size: req.file.size,
        });
        res.status(201).json(file);
      } catch (error: any) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ message: error.message });
      }
    });
  });

  app.get("/api/files/:id/download", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.getFileById(id, getUserId(req));
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (!fs.existsSync(file.path)) return res.status(404).json({ message: "Plik nie istnieje na dysku" });
    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    fs.createReadStream(file.path).pipe(res);
  });

  app.patch("/api/files/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Nazwa jest wymagana" });
    const file = await storage.updateFileName(id, getUserId(req), name.trim());
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    res.json(file);
  });

  app.delete("/api/files/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.deleteFile(id, getUserId(req));
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    res.json({ message: "Plik usuniety" });
  });

  app.get("/api/files/:id/convert", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const format = req.query.format as string;
      const file = await storage.getFileById(id, getUserId(req));
      if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
      if (!fs.existsSync(file.path)) return res.status(404).json({ message: "Plik nie istnieje na dysku" });

      const fileBuffer = fs.readFileSync(file.path);
      const baseName = path.basename(file.name, path.extname(file.name));

      if (file.type.startsWith("image/") && format === "pdf") {
        const imgMeta = await sharp(fileBuffer).metadata();
        const pdfDoc = await PDFDocument.create();
        const imgWidth = imgMeta.width || 800;
        const imgHeight = imgMeta.height || 600;
        const page = pdfDoc.addPage([imgWidth, imgHeight]);

        let pngBuffer: Buffer;
        if (file.type === "image/png") {
          pngBuffer = fileBuffer;
        } else {
          pngBuffer = await sharp(fileBuffer).png().toBuffer();
        }
        const pngImage = await pdfDoc.embedPng(pngBuffer);
        page.drawImage(pngImage, { x: 0, y: 0, width: imgWidth, height: imgHeight });

        const pdfBytes = await pdfDoc.save();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(baseName)}.pdf"`);
        return res.send(Buffer.from(pdfBytes));
      }

      if (file.type === "application/pdf" && format === "jpg") {
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(baseName)}.jpg"`);
        const jpgBuffer = await sharp(fileBuffer, { density: 150 })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 90 })
          .toBuffer();
        return res.send(jpgBuffer);
      }

      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && format === "pdf") {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        page.drawText(`Dokument: ${file.name}`, { x: 50, y: height - 50, size: 14 });
        page.drawText(`Plik DOCX zostal skonwertowany do formatu PDF.`, { x: 50, y: height - 80, size: 11 });
        const pdfBytes = await pdfDoc.save();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(baseName)}.pdf"`);
        return res.send(Buffer.from(pdfBytes));
      }

      return res.status(400).json({ message: "Nieobslugiwany format konwersji" });
    } catch (error: any) {
      console.error("[Convert] Error:", error);
      res.status(500).json({ message: "Blad konwersji: " + error.message });
    }
  });

  app.get("/api/search", isAuthenticated, async (req, res) => {
    const q = (req.query.q as string) || "";
    if (!q.trim()) return res.json({ folders: [], files: [] });
    const results = await storage.searchUserContent(getUserId(req), q.trim());
    res.json(results);
  });

  app.get("/api/chat/conversations", isAuthenticated, async (req, res) => {
    const result = await storage.getConversationsByUser(getUserId(req));
    res.json(result);
  });

  app.post("/api/chat/conversations", isAuthenticated, async (req, res) => {
    const { title } = req.body;
    const conversation = await storage.createConversation(getUserId(req), title || "Nowa rozmowa");
    res.status(201).json(conversation);
  });

  app.delete("/api/chat/conversations/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteConversation(id, getUserId(req));
    res.status(204).send();
  });

  app.get("/api/chat/conversations/:id/messages", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const conversation = await storage.getConversation(id, getUserId(req));
    if (!conversation) return res.status(404).json({ message: "Rozmowa nie znaleziona" });
    const msgs = await storage.getMessagesByConversation(id);
    res.json(msgs);
  });

  app.post("/api/chat/conversations/:id/messages", isAuthenticated, (req, res) => {
    upload.single("file")(req, res, async (uploadErr) => {
      try {
        if (uploadErr) return res.status(400).json({ message: uploadErr.message });
        const conversationId = parseInt(req.params.id);
        const userId = getUserId(req);
        const content = req.body.content || "";

        const conversation = await storage.getConversation(conversationId, userId);
        if (!conversation) return res.status(404).json({ message: "Rozmowa nie znaleziona" });

        let userContent: any = content;
        let savedContent = content;
        if (req.file) {
          const filePath = req.file.path;
          const mimeType = req.file.mimetype;
          savedContent = `[Plik: ${req.file.originalname}] ${content}`;
          if (mimeType.startsWith("image/")) {
            const imageData = fs.readFileSync(filePath);
            const base64 = imageData.toString("base64");
            userContent = [
              { type: "text", text: content || `Przesylam obraz: ${req.file.originalname}` },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
            ];
          } else {
            userContent = `[Uzytkownik przeslal plik: ${req.file.originalname} (${mimeType})]\n\n${content}`;
          }
          try { fs.unlinkSync(filePath); } catch {}
        }

        await storage.createMessage(conversationId, "user", savedContent);

        const allMessages = await storage.getMessagesByConversation(conversationId);
        const chatMessages = allMessages.slice(0, -1).map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        }));

        const systemMessage = {
          role: "system" as const,
          content: `Jestes zaawansowanym asystentem AI platformy LexVault. Odpowiadasz na DOWOLNE pytania uzytkownika - nie ograniczasz sie do tematyki prawnej.

TWOJE GLOWNE KOMPETENCJE:
- Rozlegla wiedza o polskim systemie prawnym (Konstytucja RP, KC, KPC, KK, KPK, KRO, KP, KSH, Prawo upadlosciowe, Prawo o adwokaturze, Ustawa o radcach prawnych)
- System sadow w Polsce: Sad Rejonowy, Sad Okregowy, Sad Apelacyjny, Sad Najwyzszy, WSA, NSA
- Wszystkie 9 kategorii spraw: cywilne, rodzinne, karne, prawo pracy, ubezpieczenia spoleczne, gospodarcze, wieczystoksiegowe, upadlosciowe, administracyjne

DODATKOWE KOMPETENCJE:
- Mozesz odpowiadac na pytania z dowolnej dziedziny: nauka, technologia, historia, kultura, zdrowie, edukacja, finanse, podroze, sport, rozrywka, gotowanie, i wiele innych
- Mozesz analizowac przeslane obrazy i pliki
- Mozesz generowac obrazy na zadanie uzytkownika za pomoca DALL-E (uzyj narzedzia generate_image)
- Mozesz przeszukiwac internet za pomoca narzedzia web_search

ZASADY ODPOWIEDZI:
- Odpowiadaj ZAWSZE po polsku, profesjonalnie i precyzyjnie
- Dla pytan prawnych: podawaj konkretne podstawy prawne, artykuly kodeksow, procedury krok po kroku
- Dla pozostalych pytan: odpowiadaj merytorycznie i pomocnie
- Gdy pytanie dotyczy aktualnych informacji - uzyj web_search
- Gdy uzytkownik prosi o wygenerowanie obrazu - uzyj generate_image

NARZEDZIA:
- web_search: przeszukiwanie internetu
- generate_image: generowanie obrazow za pomoca DALL-E

ZASTRZEZENIE (tylko dla porad prawnych):
Moje odpowiedzi prawne maja charakter informacyjny. Nie zastepuja profesjonalnej porady prawnej adwokata lub radcy prawnego.`,
        };

        const tools: any[] = [
          {
            type: "function",
            function: {
              name: "web_search",
              description: "Przeszukaj internet w celu znalezienia aktualnych informacji. Uzywaj dla pytan o aktualne wydarzenia, przepisy, dane.",
              parameters: {
                type: "object",
                properties: {
                  query: { type: "string", description: "Zapytanie do wyszukiwania" },
                },
                required: ["query"],
              },
            },
          },
          {
            type: "function",
            function: {
              name: "generate_image",
              description: "Wygeneruj obraz za pomoca DALL-E na podstawie opisu tekstowego. Uzywaj gdy uzytkownik prosi o stworzenie, wygenerowanie lub narysowanie obrazu.",
              parameters: {
                type: "object",
                properties: {
                  prompt: { type: "string", description: "Szczegolowy opis obrazu do wygenerowania (w jezyku angielskim dla lepszej jakosci)" },
                  size: { type: "string", enum: ["1024x1024", "1792x1024", "1024x1792"], description: "Rozmiar obrazu" },
                },
                required: ["prompt"],
              },
            },
          },
        ];

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        let fullResponse = "";
        const lastUserMessage: any = { role: "user", content: userContent };
        let currentMessages: any[] = [systemMessage, ...chatMessages, lastUserMessage];

        const maxToolRounds = 5;
        for (let round = 0; round < maxToolRounds; round++) {
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: currentMessages,
            tools,
            tool_choice: "auto",
            stream: false,
            max_tokens: 4096,
          });

          const choice = response.choices[0];
          if (!choice) break;

          if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
            currentMessages.push(choice.message);

            for (const toolCall of choice.message.tool_calls) {
              if (toolCall.function.name === "web_search") {
                const args = JSON.parse(toolCall.function.arguments);
                res.write(`data: ${JSON.stringify({ content: `\n\n_Szukam w internecie: "${args.query}"..._\n\n` })}\n\n`);
                fullResponse += `\n\n_Szukam w internecie: "${args.query}"..._\n\n`;

                let searchResult = "Brak wynikow wyszukiwania.";
                try {
                  const searchResponse = await fetch(
                    `https://api.duckduckgo.com/?q=${encodeURIComponent(args.query)}&format=json&no_html=1&skip_disambig=1`
                  );
                  if (searchResponse.ok) {
                    const data = await searchResponse.json();
                    const results: string[] = [];
                    if (data.AbstractText) results.push(`Podsumowanie: ${data.AbstractText}\nZrodlo: ${data.AbstractURL}`);
                    if (data.RelatedTopics) {
                      for (const topic of data.RelatedTopics.slice(0, 5)) {
                        if (topic.Text) results.push(`- ${topic.Text}${topic.FirstURL ? ` (${topic.FirstURL})` : ""}`);
                      }
                    }
                    if (results.length > 0) searchResult = results.join("\n");
                  }
                } catch (e) {
                  searchResult = "Blad wyszukiwania - sprobuj ponownie.";
                }

                currentMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: searchResult,
                });
              }

              if (toolCall.function.name === "generate_image") {
                const args = JSON.parse(toolCall.function.arguments);
                res.write(`data: ${JSON.stringify({ content: `\n\n_Generuje obraz..._\n\n` })}\n\n`);
                fullResponse += `\n\n_Generuje obraz..._\n\n`;

                let imageResult = "Nie udalo sie wygenerowac obrazu.";
                try {
                  const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: args.prompt,
                    n: 1,
                    size: args.size || "1024x1024",
                  });
                  const imageUrl = imageResponse.data[0]?.url;
                  if (imageUrl) {
                    imageResult = `Obraz wygenerowany pomyslnie.`;
                    const imageMarkdown = `\n\n![Wygenerowany obraz](${imageUrl})\n\n`;
                    fullResponse += imageMarkdown;
                    res.write(`data: ${JSON.stringify({ content: imageMarkdown, imageUrl })}\n\n`);
                  }
                } catch (e: any) {
                  imageResult = `Blad generowania obrazu: ${e.message}`;
                  res.write(`data: ${JSON.stringify({ content: `\n\n_Blad generowania obrazu: ${e.message}_\n\n` })}\n\n`);
                  fullResponse += `\n\n_Blad generowania obrazu: ${e.message}_\n\n`;
                }

                currentMessages.push({
                  role: "tool",
                  tool_call_id: toolCall.id,
                  content: imageResult,
                });
              }
            }
            continue;
          }

          if (choice.message.content) {
            const text = choice.message.content;
            const chunkSize = 20;
            for (let i = 0; i < text.length; i += chunkSize) {
              const chunk = text.slice(i, i + chunkSize);
              fullResponse += chunk;
              res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
            }
          }
          break;
        }

        await storage.createMessage(conversationId, "assistant", fullResponse);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error: any) {
        console.error("Chat error:", error);
        if (res.headersSent) {
          res.write(`data: ${JSON.stringify({ error: "Blad czatu" })}\n\n`);
          res.end();
        } else {
          res.status(500).json({ message: error.message || "Blad serwera" });
        }
      }
    });
  });

  app.get("/api/admin/users", isAuthenticated, requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  });

  app.patch("/api/admin/users/:id", isAuthenticated, requireAdmin, async (_req, res) => {
    res.status(403).json({ message: "Zmiana uprawnien administratora jest zablokowana. Tylko wlasciciel serwisu moze byc administratorem." });
  });

  app.delete("/api/admin/users/:id", isAuthenticated, requireAdmin, async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Uzytkownik nie znaleziony" });
    res.json({ message: "Uzytkownik usuniety" });
  });

  app.get("/api/hearings", isAuthenticated, async (req, res) => {
    const userId = getUserId(req);
    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    const startDate = req.query.start ? new Date(req.query.start as string) : undefined;
    const endDate = req.query.end ? new Date(req.query.end as string) : undefined;

    if (isLawyerRole(user.role)) {
      const hearings = await storage.getHearingsByLawyer(userId, startDate, endDate);
      return res.json(hearings);
    }

    const myCases = await storage.getCasesByClient(userId);
    const allHearings: any[] = [];
    for (const c of myCases) {
      const h = await storage.getHearingsByCase(c.id);
      allHearings.push(...h);
    }
    if (startDate || endDate) {
      const filtered = allHearings.filter(h => {
        if (startDate && new Date(h.startsAt) < startDate) return false;
        if (endDate && new Date(h.startsAt) > endDate) return false;
        return true;
      });
      return res.json(filtered);
    }
    res.json(allHearings);
  });

  app.get("/api/cases/:caseId/hearings", isAuthenticated, async (req, res) => {
    const caseId = parseInt(req.params.caseId);
    const userId = getUserId(req);
    const caseData = await storage.getCaseById(caseId);
    if (!caseData) return res.status(404).json({ message: "Sprawa nie znaleziona" });

    const user = await storage.getUserById(userId);
    if (!user) return res.status(401).json({ message: "Nie zalogowany" });

    if (isLawyerRole(user.role)) {
      if (caseData.lawyerId !== userId) return res.status(403).json({ message: "Brak dostepu" });
    } else {
      const myCases = await storage.getCasesByClient(userId);
      if (!myCases.some(c => c.id === caseId)) return res.status(403).json({ message: "Brak dostepu" });
    }

    const hearings = await storage.getHearingsByCase(caseId);
    res.json(hearings);
  });

  app.post("/api/hearings", isAuthenticated, requireLawyer, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { caseId, title, description, courtName, courtRoom, startsAt, endsAt } = req.body;
      if (!caseId || !title || !startsAt) {
        return res.status(400).json({ message: "Sprawa, tytul i data sa wymagane" });
      }

      const c = await storage.getCaseById(caseId);
      if (!c || c.lawyerId !== userId) {
        return res.status(403).json({ message: "Brak dostepu do sprawy" });
      }

      const hearing = await storage.createHearing({
        caseId,
        lawyerId: userId,
        title,
        description: description || null,
        courtName: courtName || null,
        courtRoom: courtRoom || null,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
      });
      res.status(201).json(hearing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/hearings/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = getUserId(req);
    const { title, description, courtName, courtRoom, startsAt, endsAt } = req.body;
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (courtName !== undefined) updateData.courtName = courtName;
    if (courtRoom !== undefined) updateData.courtRoom = courtRoom;
    if (startsAt !== undefined) updateData.startsAt = new Date(startsAt);
    if (endsAt !== undefined) updateData.endsAt = endsAt ? new Date(endsAt) : null;
    const hearing = await storage.updateHearing(id, userId, updateData);
    if (!hearing) return res.status(404).json({ message: "Termin nie znaleziony" });
    res.json(hearing);
  });

  app.delete("/api/hearings/:id", isAuthenticated, requireLawyer, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteHearing(id, getUserId(req));
    if (!deleted) return res.status(404).json({ message: "Termin nie znaleziony" });
    res.json({ message: "Termin usuniety" });
  });

  app.post("/api/contact", upload.single("attachment"), async (req, res) => {
    try {
      const parsed = contactFormSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Nieprawidlowe dane formularza", errors: parsed.error.flatten().fieldErrors });
      }

      const data: any = { ...parsed.data };

      if (req.file) {
        data.attachmentName = req.file.originalname;
        data.attachmentPath = req.file.path;
        data.attachmentType = req.file.mimetype;
        data.attachmentSize = req.file.size;
      }

      const submission = await storage.createContactSubmission(data);

      sendContactNotificationEmail({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        senderType: data.senderType,
        category: data.category,
        caseCategory: data.caseCategory,
        subject: data.subject,
        description: data.description,
        priority: data.priority,
        attachmentName: data.attachmentName,
      }).catch(err => console.error("Failed to send contact notification:", err));

      res.status(201).json({ message: "Zgloszenie zostalo wyslane pomyslnie", id: submission.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/contact-submissions", isAuthenticated, requireAdmin, async (_req, res) => {
    const submissions = await storage.getAllContactSubmissions();
    res.json(submissions);
  });

  app.get("/api/admin/contact-submissions/:id", isAuthenticated, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const submission = await storage.getContactSubmissionById(id);
    if (!submission) return res.status(404).json({ message: "Zgloszenie nie znalezione" });
    res.json(submission);
  });

  app.patch("/api/admin/contact-submissions/:id", isAuthenticated, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { status, adminNotes } = req.body;
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    const submission = await storage.updateContactSubmission(id, updateData);
    if (!submission) return res.status(404).json({ message: "Zgloszenie nie znalezione" });
    res.json(submission);
  });

  app.get("/api/admin/contact-submissions/:id/attachment", isAuthenticated, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const submission = await storage.getContactSubmissionById(id);
    if (!submission || !submission.attachmentPath) return res.status(404).json({ message: "Brak zalacznika" });
    if (!fs.existsSync(submission.attachmentPath)) return res.status(404).json({ message: "Plik nie istnieje" });
    res.download(submission.attachmentPath, submission.attachmentName || "attachment");
  });

  const httpServer = createServer(app);
  return httpServer;
}
