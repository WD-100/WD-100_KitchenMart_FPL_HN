import mongoose from "mongoose";
import { generateSlug } from "../utils/generateSlug";

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    slug: { type: String, unique: true },
    image: { type: String },
    code: { type: String, unique: true },
    quantity: { type: Number },
    price: { type: mongoose.Schema.Types.Decimal128 },
    photo_library: { type: JSON },
    sale_price: { type: mongoose.Schema.Types.Decimal128 },
    categories_id: { type: mongoose.Schema.Types.ObjectId, ref: "Categories" },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
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

// tự sinh ra slug từ title
productSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    let baseSlug = generateSlug(this.title);
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Kiểm tra xem slug đã tồn tại chưa
    while (await mongoose.models.Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    this.slug = uniqueSlug;
  }

  next();
});

export const Product = mongoose.model("Product", productSchema);
