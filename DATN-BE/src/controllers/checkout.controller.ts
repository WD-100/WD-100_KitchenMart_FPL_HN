import {Order} from "../models/order.model";
import {Cart} from "../models/cart.model";
import {Coupon} from "../models/coupon.model";
import {MyCoupon, MyCouponStatus} from "../models/my_coupon";
import {Product} from "../models/product.model";
import {OrderItem} from "../models/order_item.model";
import {OrderHistory} from "../models/order_history.model";
import {Decimal128} from "mongodb";
import crypto from 'crypto';
import moment from "moment-timezone";
import {dateFormat, HashAlgorithm, ignoreLogger, ProductCode, VNPay, VnpCurrCode, VnpLocale} from "vnpay";
import {createVNPayUrl, generateVNPayUrl, sortObject} from "../utils/vnpay";
import qs from 'qs';

export const checkout = async (req: any, res: any) => {
    try {
        const user_id = req.userId;
        const {
            full_name,
            c_email_address: email,
            c_phone: phone,
            c_address,
            d_address,
            c_order_notes: notes,
            order_method,
            coupon_id = null,
        } = req.body;

        const address = `${c_address}, ${d_address}`;

        const carts = await Cart.find({user_id}).populate("product_id");
        if (!carts.length) {
            return res.status(400).json({message: "Giỏ hàng trống."});
        }

        const products_price = Decimal128.fromString(String(req.body.c_total_product || "0"));
        const shipping_price = Decimal128.fromString(String(req.body.c_shipping_price || "0"));
        const discount_price = Decimal128.fromString(String(req.body.c_discount_price || "0"));
        const total_price = Decimal128.fromString(String(req.body.c_total || "0"));

        const order = new Order({
            full_name,
            email,
            phone,
            address,
            products_price,
            shipping_price,
            discount_price,
            total_price,
            note: notes,
            order_method,
            status: "PENDING",
            user_id,
            coupon_id: coupon_id || null,
        });

        await order.save();

        if (coupon_id) {
            const coupon = await Coupon.findById(coupon_id);
            if (coupon) {
                coupon.used_count = (coupon.used_count || 0) + 1;
                await coupon.save();
            }

            const myCoupon = await MyCoupon.findOne({
                user_id,
                coupon_id,
                status: "UNUSED",
            });

            if (myCoupon) {
                myCoupon.status = MyCouponStatus.USED;
                await myCoupon.save();
            }
        }

        for (const cart of carts) {
            const product = await Product.findById(cart.product_id);
            const price = product?.sale_price || 0;

            const quantity = Number(cart.quantity);
            const unit_price = Number(price);

            await OrderItem.create([{
                order_id: order._id,
                product_id: cart.product_id,
                quantity: quantity,
                price: unit_price,
                total: quantity * unit_price,
            }]);

            if (product) {
                const productQty = product.quantity as number;
                product.quantity = productQty - cart.quantity;
                await product.save();
            }
        }

        await OrderHistory.create([{
            order_id: order._id,
            user_id,
            status: "PENDING",
        }]);

        await Cart.deleteMany({user_id});

        return res.status(201).json({
            message: "Đặt hàng thành công",
            order_id: order._id,
        });
    } catch (error) {
        console.error("Checkout error:", error);
        return res.status(500).json({message: "Đặt hàng thất bại", error});
    }
};

export const checkout_vnpay = async (req: any, res: any) => {
    try {
        const total_price = req.body.c_total;

        if (!total_price || isNaN(total_price)) {
            return res.status(400).json({error: 'Invalid amount'});
        }

        const tmnCode = process.env.DEMO_VNP_TMNCODE!;
        const secret = process.env.DEMO_VNP_HASH_SECRET!;
        const vnpUrl = process.env.VNP_URL!;
        const returnUrl = process.env.VNP_RETURN_URL!;
        const {bankCode} = req.body;

        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        process.env.TZ = "Asia/Ho_Chi_Minh";

        const vnpay = new VNPay({
            tmnCode,
            secureSecret: secret,
            vnpayHost: vnpUrl,
            queryDrAndRefundHost: "https://sandbox.vnpayment.vn",
            testMode: true,
            hashAlgorithm: HashAlgorithm.SHA512,
            enableLog: true,
            loggerFn: ignoreLogger,
        });
        const tomorow = new Date();
        tomorow.setMinutes(tomorow.getMinutes() + 10);

        let orderId = moment(tomorow).format("DDHHmmss");

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: total_price,
            vnp_IpAddr: ipAddr,
            vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
            vnp_TxnRef: orderId,
            vnp_ReturnUrl: returnUrl,
            vnp_BankCode: bankCode || 'NCB',
            vnp_Locale: VnpLocale.VN,
            vnp_OrderType: ProductCode.Other,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorow),
            vnp_CurrCode: VnpCurrCode.VND,
        });

        return res.status(200).json({
            status: 1,
            message: 'Success',
            data: vnpayResponse,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'VNPay checkout failed'});
    }
};

export const checkout_vnpay_v5 = async (req: any, res: any) => {
    try {
        const total_price = req.body.c_total;

        if (!total_price || isNaN(total_price)) {
            return res.status(400).json({error: 'Invalid amount'});
        }

        // Lấy IP và xử lý IPv6 (::1) về IPv4
        const rawIp =
            req.headers['x-forwarded-for'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            (req.connection as any)?.socket?.remoteAddress;

        const ipAddr = (rawIp || '').toString().replace('::1', '127.0.0.1');

        const tmnCode = 'DX99JC99';
        const secretKey = 'NTMFIAYIYAEFEAMZVWNCESERJMBVROKS';
        const vnpUrlBase = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        const returnUrl = 'http://localhost:3000/checkout_success';

        const createDate = moment().format('YYYYMMDDHHmmss');
        const orderId = createDate + Math.floor(Math.random() * 10000); // Đảm bảo mã đơn hàng duy nhất

        const amount = total_price;
        const bankCode = req.body.bankCode;
        const orderInfo = req.body.orderDescription || 'Thanh toan don hang';
        const orderType = req.body.orderType || 'other';
        const locale = req.body.language || 'vn';
        const currCode = 'VND';

        let vnp_Params: any = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: orderType,
            vnp_Amount: amount * 100, // Nhân 100 theo yêu cầu VNPay
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        // B1: Sắp xếp tham số theo thứ tự alphabet
        vnp_Params = sortObject(vnp_Params);

        // B2: Tạo chuỗi dữ liệu ký (KHÔNG encode)
        const signData = qs.stringify(vnp_Params, {encode: false});

        // B3: Tạo secure hash SHA512
        const hmac = crypto.createHmac('sha512', secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;

        // B4: Tạo URL và ENCODE
        const vnpUrl = `${vnpUrlBase}?${qs.stringify(vnp_Params, {encode: true})}`;

        console.log("signData:", signData);
        console.log("signed:", signed);
        console.log("vnpUrl:", vnpUrl);

        return res.status(200).json({
            status: 1,
            message: 'Success',
            data: vnpUrl,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'VNPay checkout failed'});
    }
};

export const checkout_vnpay_v4 = async (req: any, res: any) => {
    try {
        const total_price = req.body.c_total;

        if (!total_price || isNaN(total_price)) {
            return res.status(400).json({error: 'Invalid amount'});
        }

        const ipAddr = req.ip || '127.0.0.1';
        const url = generateVNPayUrl(total_price, ipAddr);

        return res.status(200).json({
            status: 1,
            message: 'Success',
            data: url,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'VNPay checkout failed'});
    }
};

export const checkout_vnpay_v1 = async (req: any, res: any) => {
    try {
        const {c_total, bankCode} = req.body;
        const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

        const amount = c_total;

        const orderId = moment().format('DDHHmmss');
        const orderInfo = 'Thanh toan cho ma GD: ' + orderId;

        const url = createVNPayUrl({
            amount,
            orderId,
            bankCode,
            orderInfo,
            ipAddr: String(ipAddr),
        });

        return res.status(200).json({
            status: 1,
            message: 'Success',
            data: url,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'VNPay checkout failed'});
    }
};

export const checkout_vnpay_v2 = async (req: any, res: any) => {
    const tmnCode = process.env.DEMO_VNP_TMNCODE!;
    const secret = process.env.DEMO_VNP_HASH_SECRET!;
    const returnUrl = process.env.VNP_RETURN_URL!;

    const c_total = req.body.c_total;

    const amount = Math.round(parseFloat(c_total) * 100);

    let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    process.env.TZ = "Asia/Ho_Chi_Minh";

    const vnpay = new VNPay({
        tmnCode,
        secureSecret: secret,
        vnpayHost: "https://sandbox.vnpayment.vn",
        queryDrAndRefundHost: "https://sandbox.vnpayment.vn",
        testMode: true,
        hashAlgorithm: HashAlgorithm.SHA512,
        enableLog: true,
        loggerFn: ignoreLogger,
    });
    const tomorow = new Date();
    tomorow.setMinutes(tomorow.getMinutes() + 10);

    let orderId = moment(tomorow).format("DDHHmmss");

    const vnpayResponse = await vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: ipAddr,
        vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
        vnp_TxnRef: orderId,
        vnp_ReturnUrl: returnUrl,
        vnp_BankCode: '',
        vnp_Locale: VnpLocale.VN,
        vnp_OrderType: ProductCode.Other,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorow),
        vnp_CurrCode: VnpCurrCode.VND,
    });

    return res.status(200).json({
        status: 1,
        message: 'Success',
        data: vnpayResponse,
    });
}

export const checkout_vnpay_v3 = async (req: any, res: any) => {
    const tmnCode = process.env.VNP_TMNCODE!;
    const secret = process.env.VNP_HASH_SECRET!;
    const returnUrl = process.env.VNP_RETURN_URL!;
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const user_id = req.userId;
    const carts = await Cart.find({user_id});

    if (!carts || carts.length === 0) {
        return res.status(400).json({
            status: -1,
            message: 'Your cart is empty!',
            data: 'Your cart is empty!',
        });
    }

    const createDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');
    const {c_total, vnp_BankCode} = req.body;

    const amount = Math.round(parseFloat(c_total) * 100); // VNPAY yêu cầu x100
    const txnRef = moment().tz('Asia/Ho_Chi_Minh').format('YYYYMMDDHHmmss');

    const inputData: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Thanh toan GD:${txnRef}`,
        vnp_OrderType: '270000',
        vnp_Amount: amount.toString(),
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        vnp_CreateDate: createDate,
    };

    if (vnp_BankCode) {
        inputData['vnp_BankCode'] = vnp_BankCode;
    }

    const sortedKeys = Object.keys(inputData).sort();
    const queryArr: string[] = [];
    const hashArr: string[] = [];

    for (const key of sortedKeys) {
        const value = inputData[key];
        const encoded = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        queryArr.push(encoded);
        hashArr.push(encoded);
    }

    const query = queryArr.join('&');
    const hashData = hashArr.join('&');

    const secureHash = crypto
        .createHmac('sha512', secret)
        .update(hashData)
        .digest('hex');

    const finalUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?${query}&vnp_SecureHash=${secureHash}`;

    return res.status(201).json({
        status: 1,
        message: 'Success',
        data: finalUrl,
    });
};