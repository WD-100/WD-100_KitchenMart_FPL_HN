import {Feedback} from "../models/feedback.model";
import {returnMessage} from "../utils/response";
import {Order} from "../models/order.model";
import {User} from "../models/user.model";
import {Product} from "../models/product.model";

export const listFeedback = async (req: any, res: any) => {
    try {
        const {product_id} = req.query;
        const APPROVED = 'APPROVED';

        const filter: any = {status: APPROVED};
        if (product_id) {
            filter.product_id = product_id;
        }

        const feedbacks = await Feedback.find(filter)
            .sort({_id: -1})
            .populate('user_id')
            .lean();

        const feedbacksWithUser = feedbacks.map(fb => ({
            ...fb,
            user: fb.user_id,
        }));

        return res.status(200).json(returnMessage(1, feedbacksWithUser, 'Success!'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const storeFeedback = async (req: any, res: any) => {
    try {
        const userId = req.user?.id || req.userId;
        if (!userId) {
            return res.status(401).json(returnMessage(-1, '', 'Unauthorized'));
        }

        const {
            product_id,
            title,
            content,
            stars,
            order_id,
            thumbnail,
        } = req.body;

        const feedback = await Feedback.create({
            user_id: userId,
            product_id,
            title,
            content,
            stars,
            order_id,
            thumbnail,
            status: 'APPROVED',
        });

        return res.status(200).json(returnMessage(1, feedback, 'success'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const checkFeedback = async (req: any, res: any) => {
    try {
        const userId = req.user?.id || req.userId;
        if (!userId) {
            return res.status(401).json(returnMessage(-1, '', 'Unauthorized'));
        }

        const { product_id, order_id } = req.query;

        let isValid = false;
        let orderID = null;
        let review = null;
        let product = null;

        if (product_id && order_id) {
            const order = await Order.findOne({
                _id: order_id,
                user_id: userId,
                status: 'COMPLETED',
            }).lean();

            if (order) {
                const feedback = await Feedback.findOne({
                    product_id,
                    order_id,
                    user_id: userId,
                }).lean();

                if (feedback) {
                    const user = await User.findById(feedback.user_id).lean();

                    review = {
                        ...feedback,
                        user: user
                            ? {
                                id: user._id,
                                full_name: user.full_name,
                                email: user.email,
                            }
                            : null,
                    };

                    const foundProduct = await Product.findById(product_id).lean();
                    if (foundProduct) {
                        product = {
                            id: foundProduct._id,
                            title: foundProduct.title,
                            slug: foundProduct.slug,
                            price: foundProduct.price,
                            image: foundProduct.image,
                        };
                    }

                    isValid = true;
                    orderID = order_id;
                }
            }
        }

        return res.status(200).json(
            returnMessage(1, { valid: isValid, order: orderID, review, product }, 'success')
        );
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};