import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { app } from './app';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 4000;

server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use('/api', app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
