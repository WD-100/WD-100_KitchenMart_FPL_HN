import {Router} from "express";
import {create} from "../controllers/contact.controller";

const router = Router();

router.post("/create", create);

export default router;
