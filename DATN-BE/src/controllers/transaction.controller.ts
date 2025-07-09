import moment from "moment";

import {dateFormat, HashAlgorithm, ignoreLogger, ProductCode, VNPay, VnpCurrCode, VnpLocale,} from "vnpay";
import Transaction from "../models/transaction.model";

export const create_payment = async (req: any, res: any) => {
    const tmnCode = process.env.VNP_TMNCODE!;
    const secret = process.env.VNP_HASH_SECRET!;
    const {amount, bankCode} = req.body;

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
        vnp_ReturnUrl:
            "http://localhost:3005/api/transaction/checkout-payment-vnpay",
        vnp_BankCode: bankCode,
        vnp_Locale: VnpLocale.VN,
        vnp_OrderType: ProductCode.Other,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorow),
        vnp_CurrCode: VnpCurrCode.VND,
    });
    return res.status(200).json({
        payment_url: vnpayResponse,
    });
}

export const checkout_vnpay = async (req: any, res: any) => {
    const {
        vnp_OrderInfo,
        vnp_Amount,
        vnp_CardType,
        vnp_BankTranNo,
        vnp_PayDate,
        vnp_TransactionStatus,
        vnp_ResponseCode,
        vnp_TransactionNo,
        vnp_TxnRef,
        vnp_BankCode,
    } = req.query;
    const dataInsert = {
        orderInfo: vnp_OrderInfo,
        amount: vnp_Amount,
        bankCode: vnp_BankCode,
        transactionNo: vnp_TransactionNo,
        responseCode: vnp_ResponseCode,
        payDate: vnp_PayDate,
        cardType: vnp_CardType,
        bankTranNo: vnp_BankTranNo,
        txnRef: vnp_TxnRef,
        transactionStatus: vnp_TransactionStatus,
    };
    await Transaction.create(dataInsert);
    return res.send("Thanh toán thành công");
}