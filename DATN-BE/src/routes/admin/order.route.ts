import {Router} from "express";
import {cancel, destroy, detail, list, status} from "../../controllers/admin/order.controller";

const router = Router();

router.get("/list", list);

router.patch("/status", status);

router.patch("/cancel", cancel);

router.get("/detail/:id", detail);

router.delete("/delete/:id", destroy);

export default router;
