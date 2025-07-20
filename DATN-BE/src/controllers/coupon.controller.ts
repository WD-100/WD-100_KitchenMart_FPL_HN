import { Coupon } from "../models/coupon.model";

export const list = async (req: any, res: any) => {
  const coupons = await Coupon.find({ is_deleted: false, is_active: true });
  res.json(coupons);
};