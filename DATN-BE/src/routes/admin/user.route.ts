import {Router} from "express";
import {createUser, deleteUser, detailUser, listUsers, updateUser} from "../../controllers/admin/user.controller";
import {authenticateToken} from "../../middlewares/auth.middleware";

const router = Router();

router.get("/list", authenticateToken, listUsers);

router.get("/detail/:id", authenticateToken, detailUser);

router.post("/create", authenticateToken, createUser);

router.patch("/update/:id", authenticateToken, updateUser);

router.delete("/delete/:id", authenticateToken, deleteUser);

export default router;
