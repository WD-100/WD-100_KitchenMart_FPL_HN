import {Categories} from "../models/categories.model";
import {Product} from "../models/product.model";

export const list = async (req: any, res: any) => {
    try {
        const categories = await Categories.find({
            is_deleted: false,
        }).sort({ id: -1 });

        const result = await Promise.all(
            categories.map(async (item: any) => {
                const products = await Product.find({
                    categories_id: item._id,
                    is_deleted: false,
                    is_active: true,
                }).limit(12);

                const totalCount = await Product.countDocuments({
                    categories_id: item._id,
                    is_deleted: false,
                    is_active: true,
                });

                const sanitizedProducts = products.map(product => {
                    const p = product.toObject();

                    p.price = parseFloat(p.price?.toString() || '0');
                    p.sale_price = parseFloat(p.sale_price?.toString() || '0');

                    return p;
                });

                return {
                    ...item.toObject(),
                    count: totalCount,
                    products: sanitizedProducts,
                };
            })
        );

        res.status(201).json({
            message: 'Success!',
            statusCode: 201,
            data: result,
        });
    } catch (error) {
        console.error('List categories error:', error);
        res.status(500).json({
            message: 'Internal server error',
            statusCode: 500,
        });
    }
};
