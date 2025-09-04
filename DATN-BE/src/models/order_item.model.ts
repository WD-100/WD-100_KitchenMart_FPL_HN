import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
    {
        order_id: {type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
        product_id: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
        quantity: {type: Number, required: true, default: 1},
        price: {type: Number, required: true},
        total: {
            type: Number,
            required: true,
        },
        title: {type: String},
        image: {type: String},
        value: {type: String, required: true, trim: true},
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

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
