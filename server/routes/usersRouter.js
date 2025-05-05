import {Router} from 'express';
import { registerUser, loginUser, refreshAccessToken } from '../controllers/usersController.js';

export const usersRouter = Router();

usersRouter.post('/register', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.post('/refreshToken', refreshAccessToken);