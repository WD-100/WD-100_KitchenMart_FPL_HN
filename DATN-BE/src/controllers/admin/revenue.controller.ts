import {Revenue} from "../../models/revenue.model";
import dayjs from "dayjs";

export const listRevenues = async (req: any, res: any) => {
    try {
        const revenues = await Revenue.find().sort({_id: -1}); // giống orderByDesc('id')
        res.status(200).json({status: 1, data: revenues, message: 'Success'});
    } catch (error: any) {
        res.status(400).json({status: -1, message: error.message});
    }
};

export const chartRevenues = async (req: any, res: any) => {
    const {type} = req.query;
    try {
        let result;
        if (type === 'day') {
            result = await daySearch();
        } else if (type === 'year') {
            result = await yearSearch();
        } else {
            result = await monthSearch();
        }

        res.status(200).json({status: 1, data: result, message: 'Success'});
    } catch (error: any) {
        res.status(400).json({status: -1, message: error.message});
    }
};

const daySearch = async () => {
    const xData: string[] = [];
    const yData: number[] = Array(12).fill(0);
    let total = 0;

    const today = dayjs();
    for (let i = 11; i >= 0; i--) {
        const d = today.subtract(i, 'day');
        xData.push(d.format('DD/MM'));
    }

    const from = today.subtract(11, 'day').startOf('day').toDate();
    const to = today.endOf('day').toDate();

    const revenues = await Revenue.find({createdAt: {$gte: from, $lte: to}});

    revenues.forEach(rev => {
        const revDate = dayjs(rev.createdAt).startOf('day');
        const diff = today.diff(revDate, 'day');
        if (diff <= 11) {
            yData[11 - diff] += rev.total as number;
            total += rev.total as number;
        }
    });

    return {x_data: xData, y_data: yData, total};
};

const monthSearch = async () => {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const xData: string[] = [];
    const yData: number[] = Array(12).fill(0);
    let total = 0;

    const today = dayjs();
    for (let i = 11; i >= 0; i--) {
        const m = today.subtract(i, 'month');
        xData.push(months[m.month()]);
    }

    const from = today.subtract(11, 'month').startOf('month').toDate();
    const to = today.endOf('month').toDate();

    const revenues = await Revenue.find({createdAt: {$gte: from, $lte: to}});

    revenues.forEach(rev => {
        const revMonth = dayjs(rev.createdAt).startOf('month');
        const diff = today.diff(revMonth, 'month');
        if (diff <= 11) {
            yData[11 - diff] += rev.total as number;
            total += rev.total as number;
        }
    });

    return {x_data: xData, y_data: yData, total};
};

const yearSearch = async () => {
    const xData: string[] = [];
    const yData: number[] = Array(12).fill(0);
    let total = 0;

    const today = dayjs();
    for (let i = 11; i >= 0; i--) {
        const y = today.subtract(i, 'year');
        xData.push(y.format('YYYY'));
    }

    const from = today.subtract(11, 'year').startOf('year').toDate();
    const to = today.endOf('year').toDate();

    const revenues = await Revenue.find({createdAt: {$gte: from, $lte: to}});

    revenues.forEach(rev => {
        const revYear = dayjs(rev.createdAt).startOf('year');
        const diff = today.diff(revYear, 'year');
        if (diff <= 11) {
            yData[11 - diff] += rev.total as number;
            total += rev.total as number;
        }
    });

    return {x_data: xData, y_data: yData, total};
};