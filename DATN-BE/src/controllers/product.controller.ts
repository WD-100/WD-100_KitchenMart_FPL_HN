import { Product } from "../models/product.model";
import { Categories } from "../models/categories.model";

export const list = async (req: any, res: any) => {
  try {
    const searchValue = (req.query.value as string)?.trim() || "";
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : null;
    const availableOnly = req.query.availableOnly === "1";

    const sortField = req.query.sortField as string || "_id";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // asc/desc
    const limit = req.query.limit ? parseInt(req.query.limit as string) : null;

    const filter: any = { is_deleted: false, is_active: true };

    if (searchValue) {
      const regex = new RegExp(searchValue, "i");
      filter.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { slug: { $regex: regex } },
      ];
    }

    if (minPrice !== null || maxPrice !== null) {
      filter.price = {};
      if (minPrice !== null) filter.price.$gte = minPrice;
      if (maxPrice !== null) filter.price.$lte = maxPrice;
    }

    if (availableOnly) {
      filter.quantity = { $gt: 0 };
    }

    let query = Product.find(filter)
        .sort({ [sortField]: sortOrder });

    if (limit !== null && limit > 0) {
      query = query.limit(limit);
    }

    const products = await query.exec();

    return res.status(200).json({
      message: "success",
      data: { products }
    });
  } catch (error) {
    console.error("Error listing products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getNewProduct = async (req: any, res: any) => {
  try {
    const size = parseInt(req.query.size) || 12;
    const sortField = req.query.sort || "id";

    const sortOption: any = {};
    if (sortField === "id") {
      sortOption._id = -1;
    } else {
      sortOption[sortField] = -1;
    }

    const products = await Product.find({
      is_deleted: false,
      is_active: true,
    })
      .sort(sortOption)
      .limit(size);

    const sanitizedProducts = products.map((product) => {
      const p = product.toObject() as any;

      return {
        ...p,
        price: parseFloat(p.price?.toString() || "0"),
        sale_price: parseFloat(p.sale_price?.toString() || "0"),
      };
    });


    res.status(200).json({
      message: "Lấy sản phẩm mới nhất thành công",
      statusCode: 200,
      data: sanitizedProducts,
    });
  } catch (error) {
    console.error("Get new products error:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      statusCode: 500,
    });
  }
};

export const detail = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const product = await Product.findById({ _id: id, is_deleted: false });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });
    }

    const categories = await Categories.findById({
      _id: product.categories_id,
      is_deleted: false,
    });

    return res.status(200).json({
      message: "Product fetched successfully",
      data: {
        product,
        categories,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Server error", statusCode: 500 });
  }
};

export const getBySlug = async (req: any, res: any) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug, is_deleted: false });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        statusCode: 404,
      });
    }



    const categories = await Categories.findById({
      _id: product.categories_id,
      is_deleted: false,
    });

    return res.status(200).json({
      message: "Product fetched successfully",
      data: { product,  categories },
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return res.status(500).json({ message: "Server error", statusCode: 500 });
  }
};
