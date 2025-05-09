import { Router } from "express";
import { getAllFriends } from "../controllers/friendsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const friendsRouter = Router();

friendsRouter.get('/friends', authenticateToken, getAllFriends);