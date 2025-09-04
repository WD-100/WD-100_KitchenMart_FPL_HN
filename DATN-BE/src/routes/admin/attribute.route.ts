import {Router} from "express";
import {create, list, destroy, detail, update} from "../../controllers/admin/attribute.controller";

const router = Router();

router.post("/create", create);

router.get("/list", list);

router.get("/detail/:id", detail);

router.delete("/delete/:id", destroy);

router.patch("/update/:id", update);

export default router;
