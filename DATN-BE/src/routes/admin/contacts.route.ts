import {Router} from "express";
import {destroy, detail, list, update} from "../../controllers/admin/contact.controller";

const router = Router();

router.get("/list", list);

router.get("/detail/:id", detail);

router.patch("/update/:id", update);

router.delete("/delete/:id", destroy);

export default router;
