import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    full_name: { type: String },
    email: { type: String },
    description: { type: String },
    address: { type: String }, // địa chỉ
    address_detail: { type: String }, // địa chỉ chi tiết
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    is_deleted: { type: Boolean, default: false },
    status: { type: Number, default: 0 }, // 0: chờ duyệt, 1: đã duyệt, 2: từ chối, 3: Đã hủy
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

export const Order = mongoose.model("Order", orderSchema);
