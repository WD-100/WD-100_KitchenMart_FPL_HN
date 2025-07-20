import mongoose from "mongoose";

const categoriesSchema = new mongoose.Schema(
  {
    name: { type: String },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
       transform(doc, ret: any) {
        ret.id = ret._id.toString(); // _id → id
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Categories = mongoose.model("Categories", categoriesSchema);
