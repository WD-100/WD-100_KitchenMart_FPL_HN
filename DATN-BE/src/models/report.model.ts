import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    description: { type: String },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    amount: { type: mongoose.Schema.Types.Decimal128 },
    is_deleted: { type: Boolean, default: false },
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

export const Report = mongoose.model("Report", reportSchema);
