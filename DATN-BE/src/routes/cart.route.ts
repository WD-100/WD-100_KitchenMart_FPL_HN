import {Router} from "express";
import {
    addToCart,
    clearCartByUser,
    getCartByUser,
    removeFromCart,
    updateCartQuantity
} from "../controllers/cart.controller";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", authenticateToken, addToCart);
router.get("/list/:user_id", authenticateToken, getCartByUser);
router.put("/update/:cart_id", authenticateToken, updateCartQuantity);
router.delete("/delete/:cart_id", authenticateToken, removeFromCart);
router.delete("/clear/:user_id", authenticateToken, clearCartByUser);

export default router;
