import {returnMessage} from "../utils/response";
import {MyCoupon} from "../models/my_coupon";
import {Coupon} from "../models/coupon.model";

export const list = async (req: any, res: any) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json(returnMessage(-1, '', 'Unauthorized'));
        }

        const myCoupons = await MyCoupon.find({user_id: userId})
            .sort({_id: -1})
            .lean();

        const couponIds = myCoupons.map(item => item.coupon_id);
        const coupons = await Coupon.find({_id: {$in: couponIds}}).lean();

        const couponMap = Object.fromEntries(coupons.map(c => [c._id.toString(), c]));

        const results = myCoupons.map(item => ({
            ...item,
            coupon: couponMap[item.coupon_id.toString()] || null,
        }));

        return res.status(200).json(returnMessage(1, results, 'Success'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const detail = async (req: any, res: any) => {
    try {
        const { id } = req.params;

        const myCoupon = await MyCoupon.findById(id).lean();

        if (!myCoupon) {
            return res.status(404).json(returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!'));
        }

        const coupon = await Coupon.findById(myCoupon.coupon_id).lean();

        if (!coupon || coupon.is_deleted) {
            return res.status(404).json(returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!'));
        }

        return res.status(200).json(returnMessage(1, coupon, 'Success'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const search = async (req: any, res: any) => {
    try {
        const userId = req.userId;
        const { code, name } = req.query;

        const query: any = {
            user_id: userId,
            status: 'UNUSED',
        };

        const coupons = await MyCoupon.find(query)
            .populate({
                path: 'coupon_id',
                match: {
                    ...(code ? { code } : {}),
                    ...(name ? { name: { $regex: name, $options: 'i' } } : {}),
                },
            })
            .sort({ _id: -1 });

        const result = coupons.filter(c => c.coupon_id !== null);

        return res.status(200).json({ status: 1, data: result, message: 'Success' });
    } catch (err: any) {
        return res.status(400).json({ status: -1, message: err.message });
    }
};

export const saveCoupon = async (req: any, res: any) => {
    try {
        const userId = req.userId;
        const {coupon_id} = req.body;
        const UNUSED = 'UNUSED';

        if (!userId || !coupon_id) {
            return res.status(400).json(returnMessage(-1, '', 'Missing user_id or coupon_id'));
        }

        const coupon = await Coupon.findById(coupon_id).lean();

        if (!coupon || coupon.is_deleted) {
            return res.status(404).json(returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!'));
        }

        const existing = await MyCoupon.findOne({
            coupon_id,
            user_id: userId,
        }).lean();

        if (existing) {
            return res.status(400).json(returnMessage(-1, '', 'Bạn đã lưu phiếu giảm giá này rồi.'));
        }

        const myCoupon = await MyCoupon.create({
            coupon_id,
            user_id: userId,
            status: UNUSED,
        });

        return res.status(200).json(returnMessage(1, myCoupon, 'Success'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

export const deleteCoupon = async (req: any, res: any) => {
    try {
        const {id} = req.params;

        const coupon = await MyCoupon.findById(id);

        if (!coupon) {
            return res.status(404).json(returnMessage(-1, '', 'Không tìm thấy phiếu giảm giá!'));
        }

        await coupon.deleteOne();

        return res.status(200).json(returnMessage(1, 'Delete success!', 'Delete success!'));
    } catch (error: any) {
        return res.status(400).json(returnMessage(-1, '', error.message));
    }
};

