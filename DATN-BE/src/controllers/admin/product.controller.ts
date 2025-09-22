import {Product} from "../../models/product.model";
import {generateRandomString, generateSlug} from "../../utils/generateSlug";
import {Categories} from "../../models/categories.model";
import mongoose from "mongoose";

export const list = async (req: any, res: any) => {
    try {
        const searchValue = (req.query.value as string)?.trim() || "";

        const minPrice = req.query.minPrice
            ? parseFloat(req.query.minPrice as string)
            : null;
        const maxPrice = req.query.maxPrice
            ? parseFloat(req.query.maxPrice as string)
            : null;
        const availableOnly = req.query.availableOnly === "1";

        const filter: any = {is_deleted: false};

        if (searchValue) {
            const regex = new RegExp(searchValue, "i");
            filter.$or = [
                {title: {$regex: regex}},
                {description: {$regex: regex}},
                {slug: {$regex: regex}},
            ];
        }

        if (minPrice !== null || maxPrice !== null) {
            filter.price = {};
            if (minPrice !== null) filter.price.$gte = minPrice;
            if (maxPrice !== null) filter.price.$lte = maxPrice;
        }

        if (availableOnly) {
            filter.quantity = {$gt: 0};
        }

        const products = await Product.find(filter).sort({createdAt: -1});

        return res.status(200).json({
            message: "success",
            data: products,
        });
    } catch (error) {
        console.error("Error listing products:", error);
        return res.status(500).json({message: "Server error"});
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
        return res.status(500).json({message: "Server error", statusCode: 500});
    }
};
export const create = async (req: any, res: any) => {
    try {
        const {
            title,
            description,
            image,
            price,
            sale_price,
            photo_library,
            categories_id,
            short_description,
            is_active,
            is_hot,
        } = req.body;

        if (!title || !sale_price || !categories_id) {
            return res.status(400).json({
                message:
                    "Vui lòng cung cấp đầy đủ: title, sale_price, quantity, categories_id",
            });
        }

        const code = generateRandomString(10);

        const newProduct = await Product.create({
            title,
            short_description: short_description || "",
            description: description || "",
            image: image || "",
            code,
            quantity: 0,
            price,
            sale_price: sale_price || null,
            photo_library: photo_library || [],
            categories_id,
            is_active,
            is_hot: is_hot || false,
        });

        return res.status(201).json({
            message: "Tạo sản phẩm thành công",
            statusCode: 201,
            data: newProduct,
        });
    } catch (error) {
        console.error("Lỗi tạo sản phẩm:", error);
        return res.status(500).json({message: "Lỗi server"});
    }
};

export const update = async (req: any, res: any) => {
    const {id} = req.params;
    const {
        title,
        description,
        price,
        categories_id,
        sale_price,
        photo_library,
        image,
        is_active,
        is_hot,
        short_description,
    } = req.body;

    try {
        const product = await Product.findOne({_id: id, is_deleted: false});

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                statusCode: 404,
            });
        }

        if (title && title !== product.title) {
            const baseSlug = generateSlug(title);
            let uniqueSlug = baseSlug;
            let counter = 1;

            while (
                await Product.findOne({
                    slug: uniqueSlug,
                    _id: {$ne: product._id},
                })
                ) {
                uniqueSlug = `${baseSlug}-${counter++}`;
            }

            product.title = title;
            product.slug = uniqueSlug;
        }

        if (description !== undefined) product.description = description;
        if (photo_library !== undefined) product.photo_library = photo_library;
        if (sale_price !== undefined) {
            product.sale_price = mongoose.Types.Decimal128.fromString(
                sale_price.toString()
            );
        }
        if (price !== undefined) {
            product.price = mongoose.Types.Decimal128.fromString(price.toString());
        }
        if (categories_id !== undefined) product.categories_id = categories_id;
        if (image !== undefined) product.image = image;
        if (is_active !== undefined) product.is_active = is_active;
        if (short_description !== undefined) product.short_description = short_description;
        if (is_hot !== undefined) product.is_hot = is_hot || false;

        await product.save();
        console.log("Sau khi lưu:", product);

        return res.status(200).json({
            message: "Product updated successfully",
            statusCode: 200,
            data: product.toJSON(),
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({message: "Server error", statusCode: 500});
    }
};

export const destroy = async (req: any, res: any) => {
    const {id} = req.params;

    try {
        const product = await Product.findOne({_id: id, is_deleted: false});

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                statusCode: 404,
            });
        }

        product.is_deleted = true;

        await product.save();

        return res.status(200).json({
            message: "Product deleted successfully",
            statusCode: 200,
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({message: "Server error", statusCode: 500});
    }
};
