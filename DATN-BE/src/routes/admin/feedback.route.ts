import {Router} from "express";
import {authenticateToken} from "../../middlewares/auth.middleware";
import {deleteFeedback, detail, list, update} from "../../controllers/admin/feedback.controller";

const router = Router();

router.get('/list', authenticateToken, list);

router.patch('/update/:id', authenticateToken, update);

router.get('/detail/:id', authenticateToken, detail);

router.delete('/delete/:id', authenticateToken, deleteFeedback);

export default router;
