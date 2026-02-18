import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth/replitAuth";
import { authStorage } from "./replit_integrations/auth/storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import OpenAI from "openai";

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

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: Request, res: Response) => {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Nie zalogowany" });
    const user = await authStorage.getUser(userId);
    if (!user) return res.status(401).json({ message: "Uzytkownik nie znaleziony" });
    res.json(user);
  });

  app.get("/api/folders", isAuthenticated, async (req, res) => {
    const result = await storage.getFoldersByUser(getUserId(req));
    res.json(result);
  });

  app.post("/api/folders", isAuthenticated, async (req, res) => {
    try {
      const userId = getUserId(req);
      const { name, parentFolderId } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ message: "Nazwa folderu jest wymagana" });
      }
      if (parentFolderId) {
        const parent = await storage.getFolderById(parentFolderId, userId);
        if (!parent) {
          return res.status(404).json({ message: "Folder nadrzedny nie znaleziony" });
        }
      }
      const folder = await storage.createFolder({
        userId,
        name: name.trim(),
        parentFolderId: parentFolderId || null,
      });
      res.status(201).json(folder);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/folders/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Nazwa jest wymagana" });
    }
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
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Brak pliku" });
      }
      const userId = getUserId(req);
      const folderId = parseInt(req.body.folderId);
      if (!folderId) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Folder jest wymagany" });
      }
      const folder = await storage.getFolderById(folderId, userId);
      if (!folder) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Folder nie znaleziony" });
      }
      try {
        const file = await storage.createFile({
          userId,
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

  app.get("/api/files/:id/download", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.getFileById(id, getUserId(req));
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ message: "Plik nie istnieje na dysku" });
    }
    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");
    fs.createReadStream(file.path).pipe(res);
  });

  app.patch("/api/files/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Nazwa jest wymagana" });
    }
    const file = await storage.updateFileName(id, getUserId(req), name.trim());
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    res.json(file);
  });

  app.delete("/api/files/:id", isAuthenticated, async (req, res) => {
    const id = parseInt(req.params.id);
    const file = await storage.deleteFile(id, getUserId(req));
    if (!file) return res.status(404).json({ message: "Plik nie znaleziony" });
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    res.json({ message: "Plik usuniety" });
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

  app.post("/api/chat/conversations/:id/messages", isAuthenticated, async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = getUserId(req);
      const { content } = req.body;

      const conversation = await storage.getConversation(conversationId, userId);
      if (!conversation) return res.status(404).json({ message: "Rozmowa nie znaleziona" });

      await storage.createMessage(conversationId, "user", content);

      const allMessages = await storage.getMessagesByConversation(conversationId);
      const chatMessages = allMessages.map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      const systemMessage = {
        role: "system" as const,
        content: "Jestes asystentem prawnym LexVault. Pomagasz uzytkownikom w sprawach prawnych, analizie dokumentow i organizacji spraw. Odpowiadaj po polsku, zwiezle i profesjonalnie.",
      };

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...chatMessages],
        stream: true,
        max_tokens: 4096,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
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

  app.get("/api/admin/users", isAuthenticated, requireAdmin, async (req, res) => {
    const allUsers = await storage.getAllUsers();
    res.json(allUsers);
  });

  app.patch("/api/admin/users/:id", isAuthenticated, requireAdmin, async (req, res) => {
    const { isAdmin } = req.body;
    const user = await storage.updateUserAdmin(req.params.id, isAdmin);
    if (!user) return res.status(404).json({ message: "Uzytkownik nie znaleziony" });
    res.json(user);
  });

  app.delete("/api/admin/users/:id", isAuthenticated, requireAdmin, async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Uzytkownik nie znaleziony" });
    res.json({ message: "Uzytkownik usuniety" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
