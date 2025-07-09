import mongoose, { Document, Schema } from "mongoose";

export interface ICart extends Document {
    user_id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    quantity: number;
}

const cartSchema = new Schema<ICart>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);