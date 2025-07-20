import {Router} from "express";
import {detail, list, update} from "../../controllers/admin/order.controller";
import {authenticateToken} from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", authenticateToken, list);

router.patch("/update/:id", authenticateToken, update);

router.get("/detail/:id", authenticateToken, detail);

export default router;
