import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},

        full_name: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: String, required: true},

        address: {type: String, required: true},
        address_detail: {type: String},

        reason_cancel: {type: String, default: null},

        products_price: {type: mongoose.Schema.Types.Decimal128, required: true, default: 0},
        shipping_price: {type: mongoose.Schema.Types.Decimal128, required: true, default: 0},
        discount_price: {type: mongoose.Schema.Types.Decimal128, required: true, default: 0},
        total_price: {type: mongoose.Schema.Types.Decimal128, required: true, default: 0},

        note: {type: String, default: null}, // Ghi chú khách hàng

        order_method: {type: String, enum: ["IMMEDIATE", "CARD_CREDIT"], default: "IMMEDIATE"},
        status: {
            type: String,
            enum: ['PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELED', 'COMPLETED'],
            default: 'PENDING'
        },

        is_deleted: {type: Boolean, default: false},
    },
    {
        timestamps: true,
        toJSON: {
             transform(doc, ret: any) {
                ret.id = ret._id.toString();
                ret.products_price = parseFloat(ret.products_price);
                ret.shipping_price = parseFloat(ret.shipping_price);
                ret.discount_price = parseFloat(ret.discount_price);
                ret.total_price = parseFloat(ret.total_price);
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

export const Order = mongoose.model("Order", orderSchema);
