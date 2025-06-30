import { Discount } from "../../models/discount.model";
import { generateRandomString } from "../../utils/generateSlug";

export const list = async (req: any, res: any) => {
  const discounts = await Discount.find({ is_deleted: false });
  res.json(discounts);
};

export const detail = async (req: any, res: any) => {
  const discount = await Discount.findById(req.params.id);
  if (!discount || discount.is_deleted) {
    return res.status(404).json({ message: "Discount not found" });
  }
  res.json(discount.toJSON());
};

export const create = async (req: any, res: any) => {
  try {
    const data = req.body;
    if (!data || typeof data !== "object") {
      return res.status(400).json({ message: "Invalid request body" });
    }

    if (!data.code) {
      data.code = generateRandomString(10);
    }

    const discount = new Discount(data);
    await discount.save();
    res
      .status(201)
      .json({ message: "Discount created", data: discount.toJSON() });
  } catch (err) {
    console.error("Create discount error:", err);
    res.status(400).json({ message: "Invalid data", error: err });
  }
};

export const update = async (req: any, res: any) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!discount) {
      return res.status(404).json({ message: "Discount not found" });
    }
    res.json({ message: "Discount updated", data: discount.toJSON() });
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err });
  }
};

export const destroy = async (req: any, res: any) => {
  const discount = await Discount.findById(req.params.id);
  if (!discount) {
    return res.status(404).json({ message: "Discount not found" });
  }
  discount.is_deleted = true;
  await discount.save();
  res.json({ message: "Discount deleted" });
};
