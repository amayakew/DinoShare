import { Router } from "express";
import { addNewFriend, deleteFromFriends, getAllFriends } from "../controllers/friendsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const friendsRouter = Router();

friendsRouter.get('/friends', authenticateToken, getAllFriends);
friendsRouter.post('/addfriend', authenticateToken, addNewFriend);
friendsRouter.delete('/deletefriend/:id', authenticateToken, deleteFromFriends);