import {Router} from "express";
import {list} from "../controllers/coupon.controller";

const router = Router();

router.get("/list", list);

export default router;
