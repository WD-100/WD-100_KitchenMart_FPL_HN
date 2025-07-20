import {Router} from "express";
import {create, destroy, detail, list, update} from "../../controllers/admin/coupon.controller";

const router = Router();

router.get("/list", list);

router.get("/detail/:id", detail);

router.post("/create", create);

router.patch("/update/:id", update);

router.delete("/delete/:id", destroy);

export default router;
