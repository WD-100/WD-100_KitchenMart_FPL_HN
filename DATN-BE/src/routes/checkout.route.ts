import {Router} from "express";
import {checkout, checkout_vnpay} from "../controllers/checkout.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.post("/create", authenticateToken, checkout);
router.post("/checkout_vnpay", authenticateToken, checkout_vnpay);

export default router;
