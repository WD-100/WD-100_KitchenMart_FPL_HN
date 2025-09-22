import {Request, Response} from "express";
import mongoose from "mongoose";
import {ProductAttribute, IProductAttribute} from "../../models/product_attribute.model";
import {Product} from "../../models/product.model";

export const list = async (req: Request, res: Response) => {
    try {
        const attributes = await ProductAttribute.find()
            .populate("product_id", "title")
            .populate("attribute_id", "name");
        return res.json(attributes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error fetching product attributes", error: err});
    }
};

export const detail = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID"});
        }

        const attribute = await ProductAttribute.findById(id)
            .populate("product_id", "title")
            .populate("attribute_id", "name");

        if (!attribute) return res.status(404).json({message: "Not found"});

        return res.json(attribute);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error fetching product attribute", error: err});
    }
};

export const listByProductId = async (req: Request, res: Response) => {
    try {
        const {product_id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(product_id)) {
            return res.status(400).json({message: "Invalid product ID"});
        }

        const attributes = await ProductAttribute.find({product_id})
            .populate("attribute_id", "name"); // populate attribute info if needed

        return res.json(attributes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error fetching attributes by product", error: err});
    }
};


export const create = async (req: Request, res: Response) => {
    try {
        const {product_id, attribute_id, quantity, price, sale_price} = req.body;

        const existing = await ProductAttribute.findOne({
            product_id,
            attribute_id,
        });

        if (existing) {
            return res.status(400).json({
                message: "Sản phẩm với thuộc tính này đã tồn tại",
            });
        }

        const newProductAttribute = new ProductAttribute({
            product_id,
            attribute_id,
            quantity,
            price,
            sale_price,
        });

        const saved = await newProductAttribute.save();

        const attributes = await ProductAttribute.find({product_id})

        const product = await Product.findById({_id: product_id, is_deleted: false});

        let qty = 0;
        for (const attribute of attributes) {
            qty += attribute.quantity;
        }

        if (product) {
            product.quantity = qty;
            await product.save();
        }

        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error creating product attribute", error: err});
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const updateData = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID"});
        }

        if (updateData.product_id && updateData.attribute_id) {
            const existing = await ProductAttribute.findOne({
                product_id: updateData.product_id,
                attribute_id: updateData.attribute_id,
                _id: {$ne: id},
            });

            if (existing) {
                return res.status(400).json({
                    message: "Sản phẩm với thuộc tính này đã tồn tại",
                });
            }
        }

        const updated = await ProductAttribute.findByIdAndUpdate(id, updateData, {new: true});

        if (!updated) return res.status(404).json({message: "Not found"});

        const product_id = updateData.product_id;

        const attributes = await ProductAttribute.find({product_id})

        const product = await Product.findById({_id: product_id, is_deleted: false});

        let qty = 0;
        for (const attribute of attributes) {
            qty += attribute.quantity;
        }

        if (product) {
            product.quantity = qty;
            await product.save();
        }

        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error updating product attribute", error: err});
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid ID"});
        }

        const deleted = await ProductAttribute.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({message: "Not found"});

        return res.json({message: "Deleted successfully"});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error deleting product attribute", error: err});
    }
};
