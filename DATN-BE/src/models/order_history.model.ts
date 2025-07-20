import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            default: null,
        },
        note: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // includes createdAt, updatedAt
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

export const OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
