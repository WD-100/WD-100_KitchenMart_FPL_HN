import {Router} from "express";
import dotenv from "dotenv";
import {checkout_vnpay, create_payment} from "../controllers/transaction.controller";

dotenv.config();

const router = Router();

router.post("/create-payment", create_payment);

router.get("/checkout-payment-vnpay", checkout_vnpay);

export default router;
