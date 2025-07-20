import {Router} from "express";
import {authenticateToken} from "../../middlewares/auth.middleware";
import {chartRevenues, listRevenues} from '../../controllers/admin/revenue.controller';

const router = Router();

router.get('/list', authenticateToken, listRevenues);

router.get('/chart', authenticateToken, chartRevenues);

export default router;
