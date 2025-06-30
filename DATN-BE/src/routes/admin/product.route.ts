import { Router } from "express";
import {
  create,
  destroy,
  detail,
  list,
  update,
} from "../../controllers/admin/product.controller";

const router = Router();

router.get("/list", list);

router.post("/create", create);

router.get("/detail/:id", detail);

router.patch("/update/:id", update);

router.delete("/delete/:id", destroy);

export default router;
