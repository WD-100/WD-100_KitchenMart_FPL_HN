import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        date: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
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

export const Revenue = mongoose.model("Revenue", revenueSchema);