import {Router} from "express";
import {cancel, create, destroy, detail, list, status} from "../controllers/order.controller";

const router = Router();

router.post("/create", create);

router.get("/list", list);

router.patch("/status", status);

router.patch("/cancel", cancel);

router.get("/detail/:id", detail);

router.delete("/delete/:id", destroy);

export default router;
