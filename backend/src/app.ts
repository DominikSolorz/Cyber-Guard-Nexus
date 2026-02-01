import express from 'express';
import authRoutes from './auth/auth.routes';
import caseRoutes from './cases/case.routes';
import documentRoutes from './documents/document.routes';
import { authMiddleware } from './middlewares/auth.middleware';
import { errorMiddleware } from './middlewares/error.middleware';

export const app = express();

app.use(authMiddleware);
app.use('/auth', authRoutes);
app.use('/cases', caseRoutes);
app.use('/documents', documentRoutes);
app.use(errorMiddleware);