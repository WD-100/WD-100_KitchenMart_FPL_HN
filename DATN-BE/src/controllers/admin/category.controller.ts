import { Categories } from "../../models/categories.model";

export const list = async (req: any, res: any) => {
  try {
    const categories = await Categories.find({ is_deleted: false });
    res.status(201).json({
      message: "success",
      statusCode: 201,
      data: categories,
    });
  } catch (error) {
  }
};

export const detail = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const categories = await Categories.findById({
      _id: id,
      is_deleted: false,
    });
    if (!categories) {
      return res.status(404).json({
        message: "Categories not found",
        statusCode: 404,
      });
    }
    res.status(201).json({
      message: "success",
      statusCode: 201,
      data: categories,
    });
  } catch (error) {
  }
};

export const create = async (req: any, res: any) => {
  const { name } = req.body;
  try {
    await Categories.create({
      name,
    });
    res.status(201).json({
      message: "success",
      statusCode: 201,
    });
  } catch (error) {
  }
};
export const update = async (req: any, res: any) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const categories = await Categories.findOne({ _id: id, is_deleted: false });

    if (!categories) {
      return res.status(404).json({
        message: "Categories not found",
        statusCode: 404,
      });
    }

    if (name !== undefined) categories.name = name;

    await categories.save();

    return res.status(200).json({
      message: "Categories updated successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error updating categories:", error);
    return res.status(500).json({ message: "Server error", statusCode: 500 });
  }
};

export const destroy = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const categories = await Categories.findById({
      _id: id,
      is_deleted: false,
    });
    if (!categories) {
      return res.status(404).json({
        message: "Categories not found",
        statusCode: 404,
      });
    }
    categories.is_deleted = true;
    categories.save();
    res.status(201).json({
      message: "delete categories success",
      statusCode: 201,
    });
  } catch (error) {
  }
};
