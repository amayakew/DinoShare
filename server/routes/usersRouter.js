import {Router} from 'express';
import { registerUser, loginUser, refreshAccessToken, getAllUsers } from '../controllers/usersController.js';
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const usersRouter = Router();

usersRouter.post('/register', registerUser);
usersRouter.post('/login', loginUser);
usersRouter.post('/refreshToken', refreshAccessToken);
usersRouter.get('/addfriend', authenticateToken, getAllUsers);