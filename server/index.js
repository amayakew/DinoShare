import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { usersRouter } from './routes/usersRouter.js';
import { friendsRouter } from './routes/friendsRouter.js';
import { groupsRouter } from './routes/groupsRouter.js';

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
app.use(cookieParser());

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`run on ${PORT}`);
});

app.use('/api', usersRouter);
app.use('/api', friendsRouter);
app.use('/api', groupsRouter);