import mongoose, { Document, Schema } from "mongoose";

export interface IProductAttribute extends Document {
    product_id: mongoose.Types.ObjectId;
    attribute_id: mongoose.Types.ObjectId;
    quantity: number;
    price: mongoose.Types.Decimal128;
    sale_price?: mongoose.Types.Decimal128;
}

const productAttributeSchema = new Schema<IProductAttribute>(
    {
        product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        attribute_id: { type: Schema.Types.ObjectId, ref: "Attribute", required: true },
        quantity: {type: Number},
        price: {type: mongoose.Schema.Types.Decimal128},
        sale_price: {type: mongoose.Schema.Types.Decimal128},
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret: any) {
                ret.id = ret._id.toString(); // _id → id
                ret.price = parseFloat(ret.price); // Decimal128 → number
                ret.sale_price = parseFloat(ret.sale_price); // Decimal128 → number
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const ProductAttribute = mongoose.model<IProductAttribute>(
    "ProductAttribute",
    productAttributeSchema
);
