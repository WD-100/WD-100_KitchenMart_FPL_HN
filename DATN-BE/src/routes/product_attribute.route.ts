import {Router} from "express";
import {
    detail,
    listByProductId,
} from "../controllers/product_attribute.controller";

const router = Router();

router.get("/list-product/:id", listByProductId);

router.get("/detail/:id", detail);

export default router;