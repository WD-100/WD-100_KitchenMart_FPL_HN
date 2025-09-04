import {Router} from "express";
import {
    create,
    destroy,
    detail,
    list,
    update,
    listByProductId,
} from "../../controllers/admin/product_attribute.controller";

const router = Router();

router.get("/list", list);

router.get("/list-product/:id", listByProductId);

router.get("/detail/:id", detail);

router.post("/create", create);

router.patch("/update/:id", update);

router.delete("/delete/:id", destroy);

export default router;