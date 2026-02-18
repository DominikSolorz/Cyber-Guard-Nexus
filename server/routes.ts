import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import MemoryStore from "memorystore";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

const UPLOAD_DIR = path.resolve("uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
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

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Nie zalogowany" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET environment variable is required");
  }

  const SessionStore = MemoryStore(session);
  const isProduction = process.env.NODE_ENV === "production";

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({ checkPeriod: 86400000 }),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
      },
    })
  );

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, birthDate, password } = req.body;

      if (!firstName || !lastName || !email || !phone || !birthDate || !password) {
        return res.status(400).json({ message: "Wszystkie pola sa wymagane" });
      }

      if (password.length < 8) {
        return res.status(400).json({ message: "Haslo musi miec minimum 8 znakow" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Nieprawidlowy adres email" });
      }

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Uzytkownik z tym emailem juz istnieje" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await storage.createUser({ firstName, lastName, email, phone, birthDate, passwordHash });

      req.session.userId = user.id;

      const { passwordHash: _, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Blad serwera" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email i haslo sa wymagane" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Nieprawidlowy email lub haslo" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ message: "Nieprawidlowy email lub haslo" });
      }

      req.session.userId = user.id;

      const { passwordHash: _, ...safeUser } = user;
      res.json(safeUser);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Blad serwera" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Blad wylogowania" });
      res.clearCookie("connect.sid");
      res.json({ message: "Wylogowano" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Nie zalogowany" });
    }
    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Uzytkownik nie znaleziony" });
    }
    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  });

  app.get("/api/folders", requireAuth, async (req, res) => {
    const result = await storage.getFoldersByUser(req.session.userId!);
    res.json(result);
  });

  app.post("/api/folders", requireAuth, async (req, res) => {
    try {
      const { name, parentFolderId } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Nazwa folderu jest wymagana" });
      }
      if (parentFolderId) {
        const parent = await storage.getFolderById(parentFolderId, req.session.userId!);
        if (!parent) {
          return res.status(404).json({ message: "Folder nadrzedny nie znaleziony" });
        }
      }
      const folder = await storage.createFolder({
        userId: req.session.userId!,
        name: name.trim(),
        parentFolderId: parentFolderId || null,
      });
      res.status(201).json(folder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/folders/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Nazwa jest wymagana" });
    }
    const folder = await storage.updateFolder(id, req.session.userId!, name.trim());
    if (!folder) return res.status(404).json({ message: "Folder nie znaleziony" });
    res.json(folder);
  });

  app.delete("/api/folders/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteFolder(id, req.session.userId!);
    if (!deleted) return res.status(404).json({ message: "Folder nie znaleziony" });
    res.json({ message: "Folder usuniety" });
  });

  app.get("/api/files", requireAuth, async (req, res) => {
    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : null;
    const result = await storage.getFilesByFolder(req.session.userId!, folderId);
    res.json(result);
  });

  app.post("/api/files/upload", requireAuth, (req, res) => {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Brak pliku" });
      }
      const folderId = parseInt(req.body.folderId);
      if (!folderId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Folder jest wymagany" });
      }
      const folder = await storage.getFolderById(folderId, req.session.userId!);
      if (!folder) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Folder nie znaleziony" });
      }
      try {
        const file = await storage.createFile({
          userId: req.session.userId!,
          folderId,
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

  app.get("/api/files/:id/download", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.getFileById(id, req.session.userId!);
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: "Plik nie istnieje na dysku" });
    }
    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    fs.createReadStream(file.path).pipe(res);
  });

  app.patch("/api/files/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Nazwa jest wymagana" });
    }
    const file = await storage.updateFileName(id, req.session.userId!, name.trim());
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    res.json(file);
  });

  app.delete("/api/files/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.deleteFile(id, req.session.userId!);
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.json({ message: "Plik usuniety" });
  });

  app.get("/api/search", requireAuth, async (req, res) => {
    const q = (req.query.q as string) || "";
    if (!q.trim()) return res.json({ folders: [], files: [] });
    const results = await storage.searchUserContent(req.session.userId!, q.trim());
    res.json(results);
  });

  return httpServer;
}
