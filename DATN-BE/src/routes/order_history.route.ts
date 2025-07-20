import {Router} from "express";
import {list} from "../controllers/order_history.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.get("/list", authenticateToken, list);

export default router;
