import {Cart, ICart} from "../models/cart.model";
import {IProduct, Product} from "../models/product.model";

export const addToCart = async (req: any, res: any) => {
    try {
        const {user_id, product_id, quantity, value} = req.body;

        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({message: "Missing required fields"});
        }

        let cartItem: ICart | null = await Cart.findOne({user_id, product_id, value});

        const product: IProduct | null = await Product.findById(product_id);
        if (!product || product.is_deleted || !product.is_active) {
            return res.status(404).json({message: "Product not found"});
        }

        const requestedQty = parseInt(quantity);
        const currentQtyInCart = cartItem?.quantity ?? 0;
        const totalRequestedQty = currentQtyInCart + requestedQty;

        if (totalRequestedQty > product.quantity) {
            return res.status(400).json({
                message: `Chỉ còn lại ${product.quantity - currentQtyInCart} sản phẩm trong kho`,
            });
        }

        if (cartItem) {
            cartItem.quantity = totalRequestedQty;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({user_id, product_id, quantity: requestedQty, value});
        }

        res.status(201).json({
            message: 'Added to cart!',
            statusCode: 201,
            data: cartItem,
        });
    } catch (error: any) {
        res.status(500).json({message: "Add to cart failed", error: error.message});
    }
};

export const getCartByUser = async (req: any, res: any) => {
    try {
        const {user_id} = req.params;

        const cartItems = await Cart.find({user_id}).populate("product_id").populate({
            path: "value",
            model: "ProductAttribute",
            populate: {
                path: "attribute_id",
                model: "Attribute",
            },
        });

        res.status(201).json({
            message: 'Success!',
            statusCode: 201,
            data: cartItems,
        });
    } catch (error: any) {
        res.status(500).json({message: "Failed to get cart", error: error.message});
    }
};

export const removeFromCart = async (req: any, res: any) => {
    try {
        const {cart_id} = req.params;

        await Cart.findByIdAndDelete(cart_id);

        res.status(201).json({
            message: 'Item removed from cart!',
            statusCode: 201,
            data: null,
        });
    } catch (error: any) {
        res.status(500).json({message: "Failed to remove item", error: error.message});
    }
};

export const updateCartQuantity = async (req: any, res: any) => {
    try {
        const {cart_id} = req.params;
        const {quantity} = req.body;

        if (quantity < 1) {
            return res.status(400).json({message: "Quantity must be >= 1"});
        }

        const cartItem = await Cart.findByIdAndUpdate(
            cart_id,
            {quantity},
            {new: true}
        );

        res.status(201).json({
            message: 'updated quantity successfully!',
            statusCode: 201,
            data: cartItem,
        });
    } catch (error: any) {
        res.status(500).json({message: "Failed to update quantity", error: error.message});
    }
};

export const clearCartByUser = async (req: any, res: any) => {
    try {
        const {user_id} = req.params;

        if (!user_id) {
            return res.status(400).json({message: "Missing user_id"});
        }

        const result = await Cart.deleteMany({user_id});

        res.status(201).json({
            message: 'Cart cleared!',
            statusCode: 201,
            data: null,
        });
    } catch (error: any) {
        res.status(500).json({message: "Failed to clear cart", error: error.message});
    }
};
