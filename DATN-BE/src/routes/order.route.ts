import {Router} from "express";
import {cancel, detail, list} from "../controllers/order.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.get("/list", authenticateToken, list);

router.patch("/cancel/:id", authenticateToken, cancel);

router.get("/detail/:id", authenticateToken, detail);

export default router;
