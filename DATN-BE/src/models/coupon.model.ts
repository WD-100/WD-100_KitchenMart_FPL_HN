import mongoose, {Schema} from "mongoose";

/**
 * Schema cho mã giảm giá (Coupon)
 *
 * Các trường:
 * - code: Mã giảm giá (bắt buộc, duy nhất)
 * - type: Loại giảm giá ("percent" - theo %, "fixed" - số tiền cố định, mặc định: "percent")
 * - value: Giá trị giảm (bắt buộc)
 * - max_discount: Giảm tối đa (áp dụng cho loại theo %, không bắt buộc)
 * - min_order_value: Giá trị đơn hàng tối thiểu để áp dụng mã (không bắt buộc)
 * - usage_limit: Số lần mã được sử dụng tối đa (không bắt buộc)
 * - used_count: Số lần mã đã được sử dụng (mặc định: 0)
 * - start_date: Ngày bắt đầu hiệu lực của mã (kiểu ngày, không bắt buộc)
 * - end_date: Ngày kết thúc hiệu lực của mã (kiểu ngày, không bắt buộc)
 * - is_active: Trạng thái mã (true = đang hoạt động, mặc định: true)
 * - is_deleted: Trạng thái xóa mềm (true = đã xóa, mặc định: false)
 */

export interface ICoupon extends Document {
    name: string;
    code: string;
    type: "percent" | "fixed";
    value: number;
    max_discount?: number;
    discount_percent?: number;
    min_order_value?: number;
    usage_limit?: number;
    thumbnail: string;
    used_count: number;
    start_date?: Date;
    end_date?: Date;
    is_active: boolean;
    is_deleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema = new Schema<ICoupon>(
    {
        name: {type: String, required: true},
        code: {type: String, required: true, unique: true},
        type: {type: String, enum: ["percent", "fixed"], default: "percent"},
        value: {type: Number, required: true},
        discount_percent: {type: Number},
        max_discount: {type: Number},
        min_order_value: {type: Number},
        usage_limit: {type: Number},
        used_count: {type: Number, default: 0},
        thumbnail: {type: String},
        start_date: {type: Date},
        end_date: {type: Date},
        is_active: {type: Boolean, default: true},
        is_deleted: {type: Boolean, default: false},
    },
    {
        timestamps: true,
        toJSON: {
             transform(doc, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
