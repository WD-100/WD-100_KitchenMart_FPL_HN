import {Order} from "../../models/order.model";
import {Product} from "../../models/product.model";
import {Revenue} from "../../models/revenue.model";
import {OrderItem} from "../../models/order_item.model";
import {toNumber} from "../../utils/number_formater";
import {returnMessage} from "../../utils/response";
import dayjs from 'dayjs';
import {OrderHistory} from "../../models/order_history.model";

export const list = async (req: any, res: any) => {
    try {
        const {status, user_id} = req.query;

        const filter: any = {};

        if (status) {
            filter.status = status;
        }

        filter.is_deleted = false;

        if (user_id) {
            filter.user_id = user_id;
        }

        const orders = await Order.find(filter).sort({_id: -1});

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

        return res.status(200).json({
            message: "success",
            data: enrichedOrders,
        });
    } catch (error) {
        console.error("Error listing users:", error);
        return res.status(500).json({message: "Server error"});
    }
};

export const detail = async (req: any, res: any) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order || order.is_deleted === true) {
            return res.status(404).json(returnMessage(0, null, "Order not found"));
        }

        const orderData = {
            ...order.toObject(),
            products_price: toNumber(order.products_price),
            shipping_price: toNumber(order.shipping_price),
            discount_price: toNumber(order.discount_price),
            total_price: toNumber(order.total_price),
        }

        const orderItems = await OrderItem.find({order_id: orderId});

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

export const update = async (req: any, res: any) => {
    try {
        const userId = req.userId;

        const orderId = req.params.id;
        const reason_cancel = req.body.reason_cancel;

        const order = await Order.findById(orderId);
        if (!order || order.is_deleted == true ) {
            return res.status(404).json(returnMessage(0, null, 'Order not found'));
        }

        let status = req.body.status || order.status;

        if (status === 'CANCELED') {
            if (order.status === 'SHIPPING') {
                return res.status(400).json(returnMessage(0, null, 'Đơn hàng đang vận chuyển!'));
            }

            if (order.status === 'DELIVERED') {
                return res.status(400).json(returnMessage(0, null, 'Đơn hàng đã được giao!'));
            }

            if (order.status === 'CANCELED') {
                return res.status(400).json(returnMessage(0, null, 'Order already canceled'));
            }

            if (order.status === 'COMPLETED') {
                return res.status(400).json(returnMessage(0, null, 'Order already completed'));
            }
        }

        switch (status) {
            case 'PENDING':
                status = 'PROCESSING';
                break;
            case 'PROCESSING':
                status = 'CONFIRMED';
                break;
            case 'CONFIRMED':
                status = 'SHIPPING';
                break;
            case 'SHIPPING':
                status = 'DELIVERED';
                break;
            case 'CANCELED':
                order.reason_cancel = reason_cancel;
                status = 'CANCELED';
                break;
            case 'DELIVERED':
                status = 'COMPLETED';
                break;
            default:
                console.warn('Trạng thái không hợp lệ:', status);
                return res.status(400).json({
                    type: 'error',
                    message: 'Trạng thái không hợp lệ',
                });
        }

        order.status = status;
        await order.save();


        if (status === 'CANCELED') {
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
        }

        if (status === 'COMPLETED') {
            const now = dayjs();

            await Revenue.create({
                total: order.total_price,
                order_id: order._id,
                date: now.date(),
                month: now.month() + 1,
                year: now.year()
            });
        }

        await OrderHistory.create({
            order_id: order._id,
            status: status,
            notes: order.reason_cancel,
            user_id: userId
        });

        return res.status(200).json(returnMessage(1, order, 'Update order success'));
    } catch (error: any) {
        console.error('Update order error:', error);
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};