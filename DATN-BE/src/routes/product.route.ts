import { Router } from "express";
import {
  detail,
  getBySlug,
  getNewProduct,
  list,
} from "../controllers/product.controller";

const router = Router();

router.get("/list", list);

router.get("/new-list", getNewProduct);

router.get("/detail/:id", detail);

router.get("/slug/:slug", getBySlug);

export default router;
