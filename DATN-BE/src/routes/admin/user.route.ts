import {Router} from "express";
import {createUser, deleteUser, detailUser, listUsers, updateUser} from "../../controllers/admin/user.controller";

const router = Router();

router.get("/list", listUsers);

router.get("/detail/:id", detailUser);

router.post("/create", createUser);

router.patch("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

export default router;
