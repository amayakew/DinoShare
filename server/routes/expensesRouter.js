import { Router } from "express";
import { addNewExpense, addNewRefund } from "../controllers/expensesController.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export const expensesRouter = Router();

expensesRouter.post('/addexpense', authenticateToken, addNewExpense);
expensesRouter.post('/addrefund', authenticateToken, addNewRefund);