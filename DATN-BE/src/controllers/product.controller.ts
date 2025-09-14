import {Product} from "../models/product.model";
import {Categories} from "../models/categories.model";
import {Feedback} from "../models/feedback.model";
import mongoose from 'mongoose';

export const list = async (req: any, res: any) => {
    try {
        const keyword = (req.query.keyword as string)?.trim() || "";
        const category = req.query.category as string;
        const size = req.query.size ? parseInt(req.query.size as string, 10) : null;
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : null;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : null;
        const sort = req.query.sort as string || "";

        const filter: any = { is_deleted: false, is_active: true };

        if (keyword) {
            const regex = new RegExp(keyword, "i");
            filter.$or = [
                { title: { $regex: regex } },
                { slug: { $regex: regex } },
            ];
        }

        if (category) {
            filter.categories_id = category;
        }

        if (minPrice !== null || maxPrice !== null) {
            filter.sale_price = {};
            if (minPrice !== null) filter.sale_price.$gte = minPrice;
            if (maxPrice !== null) filter.sale_price.$lte = maxPrice;
        }

        let sortField = "_id";
        let sortOrder: mongoose.SortOrder = -1;

        switch (sort) {
            case "price_asc":
                sortField = "sale_price";
                sortOrder = 1;
                break;
            case "price_desc":
                sortField = "sale_price";
                sortOrder = -1;
                break;
            case "title_asc":
                sortField = "title";
                sortOrder = 1;
                break;
            case "title_desc":
                sortField = "title";
                sortOrder = -1;
                break;
        }

        let query = Product.find(filter).sort({ [sortField]: sortOrder });

        if (size && size > 0) {
            query = query.limit(size);
        }

        const products = await query.exec();

        return res.status(200).json({
            message: "success",
            data: { products },
        });
    } catch (error) {
        console.error("Error listing products:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getHotProduct = async (req: any, res: any) => {
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
            is_hot: true,
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
            message: "Lấy sản phẩm nổi bật thành công",
            statusCode: 200,
            data: sanitizedProducts,
        });
    } catch (error) {
        console.error("Get hot products error:", error);
        res.status(500).json({
            message: "Lỗi máy chủ",
            statusCode: 500,
        });
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
    const {id} = req.params;

    try {
        const product = await Product.findById({_id: id, is_deleted: false});

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

        const other_products = await Product.find({
            categories_id: product.categories_id,
            _id: { $ne: product._id }, // loại trừ sản phẩm hiện tại
            is_deleted: false,
        }).limit(10);

        return res.status(200).json({
            message: "Product fetched successfully",
            data: {
                product,
                categories,
                other_products,
            },
            statusCode: 200,
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({message: "Server error", statusCode: 500});
    }
};

export const getBySlug = async (req: any, res: any) => {
    const {slug} = req.params;

    try {
        const product = await Product.findOne({slug, is_deleted: false});

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                statusCode: 404,
            });
        }

        const feedbacks = await Feedback.find({
            product_id: product.id,
            is_deleted: false,
        });

        const categories = await Categories.findById({
            _id: product.categories_id,
            is_deleted: false,
        });

        const other_products = await Product.find({
            categories_id: product.categories_id,
            _id: { $ne: product._id },
            is_deleted: false,
        }).limit(10);

        return res.status(200).json({
            message: "Product fetched successfully",
            data: {product, feedbacks, categories, other_products},
            statusCode: 200,
        });
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return res.status(500).json({message: "Server error", statusCode: 500});
    }
};
