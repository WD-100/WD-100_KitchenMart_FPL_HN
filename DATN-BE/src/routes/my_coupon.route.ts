import {Router} from "express";
import {deleteCoupon, detail, list, saveCoupon, search} from "../controllers/my_coupon.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.get("/list", authenticateToken, list);

router.get("/search", authenticateToken, search);

router.get("/detail/:id", authenticateToken, detail);

router.post("/save", authenticateToken, saveCoupon);

router.delete("/delete/:id", authenticateToken, deleteCoupon);

export default router;
