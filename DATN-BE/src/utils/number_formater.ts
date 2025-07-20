import {Decimal128} from "mongodb";

export const toNumber = (val: any): number => {
    if (val instanceof Decimal128) return parseFloat(val.toString());
    return typeof val === 'object' && val?.$numberDecimal ? parseFloat(val.$numberDecimal) : val;
};

export const formatNumber = (val: any): string => {
    const number = toNumber(val);
    return number.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
};