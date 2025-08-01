import { Router } from "express";
import { Feedback } from "../models/feedback.model";
import {checkFeedback, listFeedback, storeFeedback} from "../controllers/feedback.controller";
import {authenticateToken} from "../middlewares/auth.middleware";
const router = Router();

router.get('/list', listFeedback);

router.post('/store', authenticateToken, storeFeedback);

router.get('/check', authenticateToken, checkFeedback);

export default router;
