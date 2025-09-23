import {Coupon} from "../../models/coupon.model";
import {generateRandomString} from "../../utils/generateSlug";

export const list = async (req: any, res: any) => {
    const coupons = await Coupon.find({is_deleted: false});
    res.json(coupons);
};

export const detail = async (req: any, res: any) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon || coupon.is_deleted) {
        return res.status(404).json({message: "Coupon not found"});
    }
    res.json(coupon.toJSON());
};

export const create = async (req: any, res: any) => {
    try {
        const data = req.body;
        if (!data || typeof data !== "object") {
            return res.status(400).json({message: "Invalid request body"});
        }

        if (data.name) {
            const existing = await Coupon.findOne({ name: data.name });
            if (existing) {
                return res.status(400).json({ message: "Tên Mã Giảm Giá Đã Tồn Tại" });
            }
        }

        if (!data.code) {
            data.code = generateRandomString(10);
        }

        const coupon = new Coupon(data);
        await coupon.save();
        res
            .status(201)
            .json({message: "Coupon created", data: coupon.toJSON()});
    } catch (err) {
        console.error("Create coupon error:", err);
        res.status(400).json({message: "Invalid data", error: err});
    }
};

export const update = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const data = req.body;

        if (data.name) {
            const existing = await Coupon.findOne({
                name: data.name,
                _id: { $ne: id }
            });
            if (existing) {
                return res.status(400).json({ message: "Tên phiếu giảm giá đã tồn tại!" });
            }
        }

        const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        return res.json({
            message: "Coupon updated",
            data: coupon.toJSON()
        });
    } catch (err) {
        console.error("Update coupon error:", err);
        return res.status(400).json({ message: "Update failed", error: err });
    }
};

export const destroy = async (req: any, res: any) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        return res.status(404).json({message: "Coupon not found"});
    }
    coupon.is_deleted = true;
    await coupon.save();
    res.json({message: "Coupon deleted"});
};
