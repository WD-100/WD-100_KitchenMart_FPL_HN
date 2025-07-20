import mongoose, {Document, Schema} from "mongoose";

export enum MyCouponStatus {
    UNUSED = "UNUSED",
    USED = "USED",
    EXPIRED = "EXPIRED",
}

export interface IMyCoupon extends Document {
    user_id: mongoose.Types.ObjectId;
    coupon_id: mongoose.Types.ObjectId;
    status: MyCouponStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const myCouponSchema = new Schema<IMyCoupon>(
    {
        user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
        coupon_id: {type: Schema.Types.ObjectId, ref: "Coupon", required: true},
        status: {
            type: String,
            enum: Object.values(MyCouponStatus),
            default: MyCouponStatus.UNUSED,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const MyCoupon = mongoose.model<IMyCoupon>("MyCoupon", myCouponSchema);
