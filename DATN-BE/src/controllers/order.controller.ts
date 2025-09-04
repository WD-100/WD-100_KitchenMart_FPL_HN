import {Order} from "../models/order.model";
import {OrderItem} from "../models/order_item.model";
import {toNumber} from "../utils/number_formater";
import {returnMessage} from "../utils/response";
import {Product} from "../models/product.model";
import {OrderHistory} from "../models/order_history.model";

export const list = async (req: any, res: any) => {
    try {
        const userId = req.userId;
        const status = req.query.status as string | undefined;

        const filter: any = {user_id: userId};
        if (status) {
            filter.status = status;
        }
        filter.is_deleted = false;

        const orders = await Order.find(filter).sort({createdAt: -1});

        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
                const orderItems = await OrderItem.find({order_id: order._id});
                const raw = order.toObject();

                return {
                    ...raw,
                    products_price: toNumber(raw.products_price),
                    shipping_price: toNumber(raw.shipping_price),
                    discount_price: toNumber(raw.discount_price),
                    total_price: toNumber(raw.total_price),
                    order_items: orderItems.map(item => item.toObject())
                };
            })
        );

        return res.status(200).json(returnMessage(1, enrichedOrders, "Success"));
    } catch (error) {
        console.error("Error listing users:", error);
        return res.status(500).json({message: "Server error"});
    }
};

export const detail = async (req: any, res: any) => {
    try {
        const userId = req.userId;

        const orderId = req.params.id;
        const order = await Order.findById(orderId);

        if (!order || order.is_deleted == true || String(order.user_id) !== userId) {
            return res.status(404).json(returnMessage(0, null, "Order not found"));
        }

        const orderData = {
            ...order.toObject(),
            products_price: toNumber(order.products_price),
            shipping_price: toNumber(order.shipping_price),
            discount_price: toNumber(order.discount_price),
            total_price: toNumber(order.total_price),
        }

        const orderItems = await OrderItem.find({order_id: orderId}).populate({
            path: "value",
            model: "ProductAttribute",
            populate: {
                path: "attribute_id",
                model: "Attribute",
            },
        });

        (orderData as any).order_items = await Promise.all(
            orderItems.map(async (item) => {
                const itemObj = item.toObject();

                const product = await Product.findById(item.product_id);
                (itemObj as any).product = product?.toObject() || null;

                return itemObj;
            })
        );

        return res.status(200).json(returnMessage(1, orderData, "Success"));
    } catch (error) {
        console.error("Error getting order detail:", error);
        return res.status(500).json(returnMessage(0, null, "Server error"));
    }
};

export const cancel = async (req: any, res: any) => {
    try {
        const userId = req.userId;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order || order.is_deleted == true || String(order.user_id) !== userId) {
            return res.status(404).json(returnMessage(0, null, "Order not found"));
        }

        const status = String(order.status);

        if (["SHIPPING", "CANCELED", "COMPLETED"].includes(status)) {
            const messages: Record<string, string> = {
                SHIPPING: "Đơn hàng đang vận chuyển!",
                CANCELED: "Đơn hàng đã huỷ!",
                COMPLETED: "Đơn hàng đã hoàn thành!",
            };
            return res.status(400).json(returnMessage(0, null, messages[status]));
        }

        const reasonCancel = req.body.reason_cancel;

        order.status = "CANCELED";
        order.reason_cancel = reasonCancel;
        await order.save();

        const orderItems = await OrderItem.find({order_id: order._id});

        for (const item of orderItems) {
            const product = await Product.findById(item.product_id);
            if (product) {
                if (product && typeof product.quantity === "number" && typeof item.quantity === "number") {
                    product.quantity += item.quantity;
                    await product.save();
                }
            }
        }

        const orderHistory = new OrderHistory({
            order_id: order._id,
            status: "CANCELED",
            user_id: order.user_id,
            notes: reasonCancel,
        });
        await orderHistory.save();

        return res.status(200).json(returnMessage(1, order.toObject(), "Cancel success"));
    } catch (error: any) {
        console.error("Cancel order error:", error);
        return res.status(400).json(returnMessage(-1, "", error.message));
    }
};