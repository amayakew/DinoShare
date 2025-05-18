import { Router } from "express";
import { createGroupAddMembers, deleteFromGroups, getAllGroups, leaveGroup } from "../controllers/groupsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const groupsRouter = Router();

groupsRouter.get('/groups', authenticateToken, getAllGroups);
groupsRouter.post('/addgroup', authenticateToken, createGroupAddMembers);
groupsRouter.delete('/deletegroup/:id', authenticateToken, deleteFromGroups);
groupsRouter.delete('/leavegroup/:id', authenticateToken, leaveGroup);