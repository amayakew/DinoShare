import { Router } from "express";
import { addNewFriend, getAllFriends } from "../controllers/friendsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const friendsRouter = Router();

friendsRouter.get('/friends', authenticateToken, getAllFriends);
friendsRouter.post('/addfriend', authenticateToken, addNewFriend);