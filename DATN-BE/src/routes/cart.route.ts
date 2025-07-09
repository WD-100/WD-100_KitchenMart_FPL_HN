import {Router} from "express";
import {
    addToCart,
    clearCartByUser,
    getCartByUser,
    removeFromCart,
    updateCartQuantity
} from "../controllers/cart.controller";

const router = Router();

router.post("/add", addToCart);
router.get("/list/:user_id", getCartByUser);
router.put("/update/:cart_id", updateCartQuantity);
router.delete("/delete/:cart_id", removeFromCart);
router.delete("/clear/:user_id", clearCartByUser);

export default router;
