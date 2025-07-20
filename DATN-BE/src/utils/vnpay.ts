import qs from 'qs';
import crypto from 'crypto';
import moment from 'moment';

export function createVNPayUrl(params: {
    amount: number;
    orderId: string;
    bankCode?: string;
    orderInfo: string;
    ipAddr: string;
}) {
    const {
        amount,
        orderId,
        bankCode = '',
        orderInfo,
        ipAddr,
    } = params;

    const tmnCode = process.env.VNP_TMNCODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const createDate = moment().format('YYYYMMDDHHmmss');

    let vnpParams: any = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'other',
        vnp_Amount: amount,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode !== '') {
        vnpParams.vnp_BankCode = bankCode;
    }

    vnpParams = sortObject(vnpParams);

    const signData = qs.stringify(vnpParams, {encode: false});
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    vnpParams.vnp_SecureHash = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnpParams, {encode: true})}`;

    return paymentUrl;
}

export const generateVNPayUrl = (amount: number, ipAddr: string): string => {
    const tmnCode = process.env.VNP_TMNCODE!;
    const secretKey = process.env.VNP_HASH_SECRET!;
    const vnpUrl = process.env.VNP_URL!;
    const returnUrl = process.env.DEMO_VNP_HASH_SECRET!;

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const orderId = `${Date.now()}`;

    const vnp_Params: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: 'Thanh toán đơn hàng',
        vnp_OrderType: 'billpayment',
        vnp_Amount: (amount * 100).toString(),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    const sorted = sortObject(vnp_Params);
    const signData = qs.stringify(sorted, {encode: false});
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    sorted['vnp_SecureHash'] = signed;
    return `${vnpUrl}?${qs.stringify(sorted, {encode: true})}`;
};

export const sortObject = (obj: Record<string, string>) => {
    const sorted: Record<string, string> = {};
    Object.keys(obj).sort().forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
};