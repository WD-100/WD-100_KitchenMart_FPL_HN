import {returnMessage} from "../utils/response";
import {OrderHistory} from "../models/order_history.model";
import {User} from "../models/user.model";

export const list = async (req: any, res: any) => {
    try {
        const { order_id } = req.query;

        if (!order_id) {
            return res.status(400).json(returnMessage(-1, '', 'Missing order_id'));
        }

        const orderHistories = await OrderHistory.find({order_id}).sort({_id: -1}).lean();

        const historiesWithUser = await Promise.all(orderHistories.map(async (item) => {
            const user = await User.findById(item.user_id).lean();
            return {
                ...item,
                user_name: user?.email || null,
            };
        }));

        return res.status(200).json(returnMessage(1, historiesWithUser, 'Success'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

