import {Order} from "../models/order.model";
import {Product} from "../models/product.model";
import {Report} from "../models/report.model";
import {User} from "../models/user.model";

export const create = async (req: any, res: any) => {
    const {
        description,
        product_id,
        user_id,
        email,
        phone_number,
        full_name,
        address,
        address_detail,
    } = req.body;

    console.log("Payload nhận được:", req.body);
    if (!product_id || !user_id) {
        return res.status(400).json({
            message: "Missing product_id or user_id in payload",
            statusCode: 400,
        });
    }

    try {
        const user = await User.findById({_id: user_id});
        if (!user) {
            return res.status(400).json({
                message: "user not found",
                statusCode: 400,
            });
        }
        await Order.create({
            description,
            product_id,
            user_id,
            email,
            phone_number,
            full_name,
            address,
            address_detail,
        });
        res.status(201).json({
            message: "success",
            statusCode: 201,
        });
    } catch (error) {
        console.log(error);
    }
};

export const list = async (req: any, res: any) => {
    try {
        const searchValue = (req.query.value as string)?.trim() || "";
        const page = parseInt(req.query.page as string) || 1;
        const status = parseInt(req.query.status as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {is_deleted: false, status};

        if (searchValue) {
            const regex = new RegExp(searchValue, "i");
            filter.$or = [
                {full_name: {$regex: regex}},
                {email: {$regex: regex}},
                {phone_number: {$regex: regex}},
            ];
        }

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({createdAt: -1})
                .populate({path: "product_id", select: "title"})
                .populate({path: "user_id", select: "full_name email"}),
            Order.countDocuments(filter),
        ]);

        return res.status(200).json({
            message: "success",
            data: {
                orders,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    limit,
                },
            },
        });
    } catch (error) {
        console.error("Error listing users:", error);
        return res.status(500).json({message: "Server error"});
    }
};

export const status = async (req: any, res: any) => {
    const {product_id, type} = req.body;

    if (!product_id || !type) {
        return res.status(400).json({
            message: "Missing product_id or type in payload",
            statusCode: 400,
        });
    }

    if (!["approve", "reject", "cancel"].includes(type)) {
        return res.status(400).json({
            message: "Invalid type. Must be 'approve' or 'reject'",
            statusCode: 400,
        });
    }

    try {
        const order = await Order.findOne({product_id});

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                statusCode: 404,
            });
        }

        const statusMap: any = {
            approve: 1,
            reject: 2,
            cancel: 2,
        };

        const responseProduct = await Product.findById({
            _id: product_id,
            is_deleted: false,
        });
        order.status = statusMap[type];
        if (type === "approve") {
            await Report.create({
                product_id,
                amount: responseProduct?.price,
            });
        }

        await order.save();

        return res.status(200).json({
            message: `${type} order success`,
            statusCode: 200,
        });
    } catch (error) {
        console.error("Order status update failed:", error);
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        });
    }
};

export const cancel = async (req: any, res: any) => {
    const {product_id} = req.body;

    if (!product_id) {
        return res.status(400).json({
            message: "Missing product_id  in payload",
            statusCode: 400,
        });
    }

    try {
        const order = await Order.findOne({product_id});

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                statusCode: 404,
            });
        }

        order.status = 3;
        await order.save();

        return res.status(200).json({
            message: `Cancel order success`,
            statusCode: 200,
        });
    } catch (error) {
        console.error("Order status update failed:", error);
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        });
    }
};

export const detail = async (req: any, res: any) => {
    const {id} = req.params;

    try {
        const order = await Order.findById({_id: id, is_deleted: false});

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                statusCode: 404,
            });
        }

        return res.status(200).json({
            message: "success",
            statusCode: 200,
            data: order,
        });
    } catch (error) {
        console.error("Error in order detail:", error);
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        });
    }
};

export const destroy = async (req: any, res: any) => {
    const {id} = req.params;

    try {
        const order = await Order.findById({_id: id, is_deleted: false});

        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                statusCode: 404,
            });
        }

        order.is_deleted = true;
        order.save();

        return res.status(200).json({
            message: "delete order success",
            statusCode: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            statusCode: 500,
        });
    }
};