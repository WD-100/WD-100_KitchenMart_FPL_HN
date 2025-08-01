import {Feedback} from "../../models/feedback.model";
import {User} from "../../models/user.model";
import {Product} from "../../models/product.model";
import {returnMessage} from "../../utils/response";

export const list = async (req: any, res: any) => {
    try {
        const feedbacks = await Feedback.find({is_deleted: false})
            .sort({_id: -1})
            .lean();

        const userIds = feedbacks.map(fb => fb.user_id?.toString()).filter(Boolean);
        const productIds = feedbacks.map(fb => fb.product_id?.toString()).filter(Boolean);

        const [users, products] = await Promise.all([
            User.find({_id: {$in: userIds}}).lean(),
            Product.find({_id: {$in: productIds}}).lean()
        ]);

        const userMap = users.reduce((acc: any, user) => {
            acc[user._id.toString()] = user;
            return acc;
        }, {});

        const productMap = products.reduce((acc: any, product) => {
            acc[product._id.toString()] = product;
            return acc;
        }, {});

        const results = feedbacks.map(fb => {
            const productKey = fb.product_id ? fb.product_id.toString() : null;
            const userKey = fb.user_id ? fb.user_id.toString() : null;

            return {
                ...fb,
                product_name: productKey ? productMap[productKey]?.name || null : null,
                email: userKey ? userMap[userKey]?.email || null : null,
                phone: userKey ? userMap[userKey]?.phone || null : null,
            };
        });

        return res.status(200).json(returnMessage(1, results, "Success!"));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const detail = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findOne({
            _id: id,
            is_deleted: false
        }).lean();

        if (!feedback) {
            return res.status(404).json({
                type: -1,
                status: "error",
                message: "Review not found!",
                data: null
            });
        }

        return res.status(200).json({
            type: 1,
            status: "success",
            message: "Success!",
            data: feedback
        });

    } catch (error: any) {
        return res.status(400).json({
            type: -1,
            status: "error",
            message: error.message,
            data: null
        });
    }
};

export const update = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await Feedback.findOne({
            _id: id,
            is_deleted: false
        });

        if (!feedback) {
            return res.status(404).json({
                type: -1,
                message: "Review not found!",
                data: null
            });
        }

        feedback.status = status;

        const updated = await feedback.save();

        if (updated) {
            return res.status(200).json({
                type: 1,
                message: "Success, Update success!",
                data: updated
            });
        }

        return res.status(400).json({
            type: -1,
            message: "Error, Update error!",
            data: null
        });
    } catch (error: any) {
        return res.status(400).json({
            type: -1,
            message: error.message,
            data: null
        });
    }
};

export const deleteFeedback = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findOne({ _id: id, is_deleted: false });

        if (!feedback) {
            return res.status(404).json({
                status: -1,
                message: "Không tìm thấy phản hồi!",
                data: null,
            });
        }

        feedback.is_deleted = true;
        await feedback.save();

        return res.status(200).json({
            status: 1,
            message: "Xoá thành công!",
            data: feedback,
        });
    } catch (error: any) {
        return res.status(400).json({
            status: -1,
            message: error.message || "Đã xảy ra lỗi khi xoá phản hồi!",
            data: null,
        });
    }
};