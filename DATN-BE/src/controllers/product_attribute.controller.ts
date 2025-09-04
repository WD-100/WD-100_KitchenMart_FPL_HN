import {Request, Response} from "express";
import mongoose from "mongoose";
import {ProductAttribute, IProductAttribute} from "../models/product_attribute.model";

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
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid product ID"});
        }

        const attributes = await ProductAttribute.find({ product_id: id })
            .populate("attribute_id", "name");

        return res.json(attributes);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error fetching attributes by product", error: err});
    }
};