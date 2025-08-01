import {Order} from "../models/order.model";
import {Cart} from "../models/cart.model";
import {Coupon} from "../models/coupon.model";
import {MyCoupon, MyCouponStatus} from "../models/my_coupon";
import {IProduct, Product} from "../models/product.model";
import {OrderItem} from "../models/order_item.model";
import {OrderHistory} from "../models/order_history.model";
import {Decimal128} from "mongodb";
import moment from "moment-timezone";
import {dateFormat, HashAlgorithm, ignoreLogger, ProductCode, VNPay, VnpCurrCode, VnpLocale} from "vnpay";

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

        for (const cart of carts) {
            const product: IProduct | null = await Product.findById(cart.product_id);
            if (!product || product.is_deleted || !product.is_active) {
                return res.status(400).json({message: "Sản phẩm không tồn tại."});
            }

            if (product.quantity < cart.quantity) {
                return res.status(400).json({message: "Số lượng sản phẩm trong kho không đủ."});
            }
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
                title: product?.title ?? '',
                image: product?.image ?? null,
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

export const quickOrder = async (req: any, res: any) => {
    try {
        const user_id = req.userId;
        const {
            product_id,
            quantity = 1,
            full_name,
            c_email_address: email,
            c_phone: phone,
            c_address,
            d_address,
            c_order_notes: notes,
            order_method,
        } = req.body;

        const address = `${c_address}, ${d_address}`;
        const product: IProduct | null = await Product.findById(product_id);

        if (!product || product.is_deleted || !product.is_active) {
            return res.status(400).json({message: "Sản phẩm không hợp lệ."});
        }

        if (product.quantity < quantity) {
            return res.status(400).json({message: "Sản phẩm không đủ số lượng."});
        }

        const unit_price = Number(product.sale_price || 0);
        const products_price = Decimal128.fromString(String(unit_price * quantity));
        const shipping_price = Decimal128.fromString("0");
        const discount_price = Decimal128.fromString("0");
        const total_price = Decimal128.fromString(String(unit_price * quantity));

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
        });

        await order.save();

        await OrderItem.create([{
            order_id: order._id,
            product_id: product._id,
            quantity,
            price: unit_price,
            total: unit_price * quantity,
            title: product.title ?? '',
            image: product.image ?? null,
        }]);

        product.quantity -= quantity;
        await product.save();

        await OrderHistory.create([{
            order_id: order._id,
            user_id,
            status: "PENDING",
        }]);

        return res.status(201).json({
            message: "Mua hàng nhanh thành công",
            order_id: order._id,
        });
    } catch (error) {
        console.error("Quick order error:", error);
        return res.status(500).json({message: "Mua hàng thất bại", error});
    }
};

export const checkout_vnpay = async (req: any, res: any) => {
    try {
        const user_id = req.userId;

        const carts = await Cart.find({user_id}).populate("product_id");
        if (!carts.length) {
            return res.status(400).json({message: "Giỏ hàng trống."});
        }

        for (const cart of carts) {
            const product: IProduct | null = await Product.findById(cart.product_id);
            if (!product || product.is_deleted || !product.is_active) {
                return res.status(400).json({message: "Không tồn tại sản phẩm."});
            }

            if (product.quantity < cart.quantity) {
                return res.status(400).json({message: "Số lượng sản phẩm trong kho không đủ."});
            }
        }

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