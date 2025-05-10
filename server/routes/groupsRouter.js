import { Router } from "express";
import { createGroupAddMembers, getAllGroups } from "../controllers/groupsController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const groupsRouter = Router();

groupsRouter.get('/groups', authenticateToken, getAllGroups);
groupsRouter.post('/addgroup', authenticateToken, createGroupAddMembers);