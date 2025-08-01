import {Router} from "express";
import {detail, getBySlug, getHotProduct, getNewProduct, list,} from "../controllers/product.controller";

const router = Router();

router.get("/list", list);

router.get("/new-list", getNewProduct);

router.get("/hot-list", getHotProduct);

router.get("/detail/:id", detail);

router.get("/slug/:slug", getBySlug);

export default router;
