import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    is_deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString(); // _id → id
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Role = mongoose.model("Role", roleSchema);
