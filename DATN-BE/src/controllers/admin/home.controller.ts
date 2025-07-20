import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Order} from "../../models/order.model";
import {OrderItem} from "../../models/order_item.model";
import {User} from "../../models/user.model";
import {Revenue} from "../../models/revenue.model";

dayjs.extend(utc);
dayjs.extend(timezone);
const now = dayjs().tz('Asia/Ho_Chi_Minh');

export const dashboard = async (req: any, res: any) => {
    try {
        const {type, size, sort, keyword} = req.query;

        const data = {
            order_action: await calculateOrder(type, size, sort, keyword),
            member_action: await calculateMembers(type, size, sort, keyword),
            revenue_action: await calculateRevenue(type, size, sort, keyword),
            product_action: await getTopProduct(type, size, sort, keyword),
        };

        return res.status(200).json({status: 1, data, message: 'Success'});
    } catch (err: any) {
        console.error('Dashboard Error:', err);
        return res.status(400).json({status: -1, data: null, message: err.message});
    }
};

export const chartOrders = async (req: any, res: any) => {
    const {type} = req.query;
    const date = now;

    let start, end;
    if (type === 'day') {
        start = date.startOf('day');
        end = date.endOf('day');
    } else if (type === 'year') {
        start = date.startOf('year');
        end = date.endOf('year');
    } else {
        start = date.startOf('month');
        end = date.endOf('month');
    }

    const orders = await Order.find({
        createdAt: {$gte: start.toDate(), $lte: end.toDate()},
        is_deleted: false,
    });

    const countByStatus = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        process: orders.filter(o => o.status === 'PROCESSING').length,
        confirm: orders.filter(o => o.status === 'CONFIRMED').length,
        shipping: orders.filter(o => o.status === 'SHIPPING').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        canceled: orders.filter(o => o.status === 'CANCELED').length,
    };

    return res.status(200).json({status: 1, data: countByStatus, message: 'Success'});
};

export const getBestSellingProducts = async (req: any, res: any) => {
    try {
        const topProducts = await OrderItem.aggregate([
            {
                $group: {
                    _id: '$product_id',
                    total_sold: {$sum: '$quantity'},
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            {$unwind: '$product'},
            {
                $project: {
                    _id: 0,
                    name: '$product.name',
                    price: '$product.price',
                    total_sold: 1,
                    quantity_remaining: '$product.quantity',
                },
            },
            {$sort: {total_sold: -1}},
            {$limit: 10},
        ]);

        return res.status(200).json({
            status: 1,
            data: topProducts,
            message: 'Top bán chạy',
        });
    } catch (error) {
        console.error('Error fetching best selling products:', error);
        return res.status(500).json({
            status: -1,
            message: 'Lỗi server',
        });
    }
};

const getTopProduct = async (type: any, size: any, sort: any, keyword: any) => {
    const result = await OrderItem.aggregate([
        {
            $group: {
                _id: '$product_id',
                total_sold: { $sum: '$quantity' },
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: '_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
        {
            $project: {
                _id: 0,
                title: '$product.title',
                image: '$product.image',
                sale_price: { $toDouble: '$product.sale_price' },
                total_sold: 1,
            },
        },
        { $sort: { total_sold: -1 } },
        { $limit: 10 },
    ]);

    return { top_products: result };
};

const calculateMembers = async (type: any, size: any, sort: any, keyword: any) => {
    const totalMember = await User.countDocuments({status: {$ne: 'DELETED'}});

    const currentStart = now.startOf('month').toDate();
    const currentEnd = now.endOf('month').toDate();
    const prevStart = now.subtract(1, 'month').startOf('month').toDate();
    const prevEnd = now.subtract(1, 'month').endOf('month').toDate();

    const currentMember = await User.countDocuments({
        status: {$ne: 'DELETED'},
        createdAt: {$gte: currentStart, $lte: currentEnd},
    });

    const prevMember = await User.countDocuments({
        status: {$ne: 'DELETED'},
        createdAt: {$gte: prevStart, $lte: prevEnd},
    });

    const isIncrease = currentMember >= prevMember;
    const percentChange = prevMember === 0
        ? currentMember > 0 ? 100 : 0
        : Math.round(Math.abs((currentMember - prevMember) / prevMember) * 100 * 100) / 100;

    return {
        total_member: totalMember,
        current_member: currentMember,
        prev_member: prevMember,
        is_increase: isIncrease,
        percent_change: percentChange,
    };
};

const calculateOrder = async (type: any, size: any, sort: any, keyword: any) => {
    const totalOrder = await Order.countDocuments({status: {$nin: ['CANCELED', 'DELETED']}});

    const currentStart = now.startOf('month').toDate();
    const currentEnd = now.endOf('month').toDate();
    const prevStart = now.subtract(1, 'month').startOf('month').toDate();
    const prevEnd = now.subtract(1, 'month').endOf('month').toDate();

    const currentOrder = await Order.countDocuments({
        status: {$nin: ['CANCELED', 'DELETED']},
        createdAt: {$gte: currentStart, $lte: currentEnd},
    });

    const prevOrder = await Order.countDocuments({
        status: {$nin: ['CANCELED', 'DELETED']},
        createdAt: {$gte: prevStart, $lte: prevEnd},
    });

    const recentOrder = await Order.find({
        createdAt: {
            $gte: now.startOf('day').toDate(),
            $lte: now.endOf('day').toDate(),
        },
    }).sort({_id: -1});

    const isIncrease = currentOrder >= prevOrder;
    const percentChange = prevOrder === 0
        ? currentOrder > 0 ? 100 : 0
        : Math.round(Math.abs((currentOrder - prevOrder) / prevOrder) * 100 * 100) / 100;

    return {
        total_order: totalOrder,
        recent_order: recentOrder,
        current_order: currentOrder,
        prev_order: prevOrder,
        is_increase: isIncrease,
        percent_change: percentChange,
    };
};

const calculateRevenue = async (type: any, size: any, sort: any, keyword: any) => {
    const totalRevenue = await Revenue.aggregate([
        {$group: {_id: null, total: {$sum: '$total'}}},
    ]);
    const currentMonth = now.month() + 1;

    const currentRevenue = await Revenue.aggregate([
        {$match: {month: currentMonth}},
        {$group: {_id: null, total: {$sum: '$total'}}},
    ]);

    const prevRevenue = await Revenue.aggregate([
        {$match: {month: currentMonth - 1}},
        {$group: {_id: null, total: {$sum: '$total'}}},
    ]);

    const currentTotal = currentRevenue[0]?.total || 0;
    const prevTotal = prevRevenue[0]?.total || 0;
    const total = totalRevenue[0]?.total || 0;
    const isIncrease = currentTotal >= prevTotal;
    const percent = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

    return {
        total_revenue: total,
        current_total_revenue: currentTotal,
        prev_total_revenue: prevTotal,
        is_increase: isIncrease,
        percent_change: Math.round(percent * 100) / 100,
    };
};