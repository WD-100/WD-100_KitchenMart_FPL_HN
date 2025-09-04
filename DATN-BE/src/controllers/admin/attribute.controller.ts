import {Request, Response} from "express";
import {Attribute} from "../../models/attribute.model";

export const create = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({message: "Tên thuộc tính là bắt buộc"});
        }

        const attribute = new Attribute({name});
        await attribute.save();

        res.status(201).json(attribute);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

export const list = async (req: Request, res: Response) => {
    try {
        const attributes = await Attribute.find().sort({createdAt: -1});
        res.json(attributes);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

export const detail = async (req: Request, res: Response) => {
    try {
        const attribute = await Attribute.findById(req.params.id);

        if (!attribute) {
            return res.status(404).json({message: "Không tìm thấy thuộc tính"});
        }

        res.json(attribute);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

export const update = async (req: Request, res: Response) => {
    try {
        const {name} = req.body;

        const attribute = await Attribute.findByIdAndUpdate(
            req.params.id,
            {name},
            {new: true, runValidators: true}
        );

        if (!attribute) {
            return res.status(404).json({message: "Không tìm thấy thuộc tính"});
        }

        res.json(attribute);
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};

export const destroy = async (req: Request, res: Response) => {
    try {
        const attribute = await Attribute.findByIdAndDelete(req.params.id);

        if (!attribute) {
            return res.status(404).json({message: "Không tìm thấy thuộc tính"});
        }

        res.json({message: "Xóa thuộc tính thành công"});
    } catch (error: any) {
        res.status(500).json({message: error.message});
    }
};
