import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import orderService from '../Service/OrderService';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import cartService from "../Service/CartService";
import couponService from "../Service/CouponService";
import ConvertCurrency from "../Shared/Utils/ConvertCurrency";
import accountService from "../Service/AccountService";
import LoadingPage from "../Shared/Utils/LoadingPage";
import {message} from "antd";

function Checkout() {
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [user, setUser] = useState(null);
    const [coupon, setCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [totalProduct, setTotalProduct] = useState(0);
    const [discountPrice, setDiscountPrice] = useState(0);
    const [total, setTotal] = useState(0);
    const [orderMethod, setOrderMethod] = useState('cod');
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();

    // Refs for controlled inputs if needed
    const formRef = useRef(null);

    const getUser = async () => {
        try {
            const res = await accountService.getInfo();
            setUser(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const getListProductCart = async () => {
        try {
            const res = await cartService.listCart();
            setCarts(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCoupon = async () => {
        if (!couponCode.trim()) return message.error('Vui lòng nhập mã giảm giá');
        setLoading(true);
        try {
            const res = await couponService.searchMyCoupon(couponCode.trim());
            if (res.status === 200 && res.data.data.length > 0) {
                const foundCoupon = res.data.data[0];
                const coupon = foundCoupon.coupon_id;
                validateAndApplyCoupon(coupon);
            } else {
                message.error('Không tìm thấy mã giảm giá hợp lệ');
            }
        } catch (err) {
            console.error(err);
            message.error('Không tìm thấy mã giảm giá hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    const validateAndApplyCoupon = (coupon) => {
        const minTotal = Number(coupon.min_order_value);
        if (totalProduct < minTotal) {
            message.error(`Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã: ${ConvertCurrency(minTotal)}`);
            return;
        }

        const percent = coupon.discount_percent;
        const maxDiscount = coupon.max_discount;
        const discount = Math.min((totalProduct * percent) / 100, maxDiscount);

        setCoupon(coupon);
        setDiscountPrice(discount);

        calcTotal();
    };

    const calcTotal = () => {
        const totalProductCost = carts.reduce((sum, item) => {
            return sum + item.product_id.sale_price * item.quantity;
        }, 0);

        const totalAfterDiscount = totalProductCost - discountPrice;
        console.log(totalAfterDiscount, discountPrice, totalProductCost);
        setTotalProduct(totalProductCost);
        setTotal(totalAfterDiscount);
    };

    useEffect(() => {
        getUser();
        getListProductCart();
    }, []);

    useEffect(() => {
        calcTotal();
    }, [carts, discountPrice]);

    useEffect(() => {
        if (user) {
            setFormData((prev) => ({
                ...prev,
                full_name: user.full_name || '',
                c_address: user.address || '',
                c_email_address: user.email || '',
                c_phone: user.phone_number || '',
            }));
        }
    }, [user]);


    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckout = async () => {
        if (!formRef.current) return;

        const requiredFields = ['full_name', 'c_address', 'd_address', 'c_email_address', 'c_phone'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                message.error(`${field} không được bỏ trống!`);
                return;
            }
        }

        const data = {
            ...formData,
            order_method: orderMethod === 'cod' ? 'IMMEDIATE' : 'CARD_CREDIT',
            coupon_id: coupon?.id || null,
            c_total_product: totalProduct,
            c_discount_price: discountPrice,
            c_total: total
        };

        setLoading(true);

        try {
            if (orderMethod === 'cod') {
                const res = await orderService.createOrder(data);
                console.log('Đặt hàng thành công:', res.data);
                navigate('/thanks-you');
            } else {
                const res = await orderService.createOrderVnpay(data);
                localStorage.setItem('order_info', JSON.stringify(data));
                window.location.href = res.data.data;
            }
        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
        } finally {
            setLoading(false);
        }
    };

    return (<div className="site-wrap">
        <Header/>
        <div className="bg-light py-3">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                        className="mx-2 mb-0">/</span> <a href="/cart">Giỏ hàng</a> <span
                        className="mx-2 mb-0">/</span> <strong className="text-black">Thanh toán</strong></div>
                </div>
            </div>
        </div>

        {loading && LoadingPage}

        <div className="site-section">
            <div className="container">
                {carts.length === 0 ? (<div>
                    <div className="text-center">
                        <p>Giỏ hàng của bạn hiện đang trống.</p>
                    </div>
                </div>) : (
                    <form ref={formRef} id="formCheckout" className="row" onSubmit={(e) => {
                        e.preventDefault();
                        handleCheckout();
                    }}>
                        {/* LEFT SIDE - Billing details */}
                        <div className="col-md-6 mb-5 mb-md-0">
                            <h2 className="h3 mb-3 text-black">Chi tiết thanh toán</h2>
                            <div className="p-3 p-lg-5 border">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <label htmlFor="full_name" className="text-black">Tên của bạn <span
                                            className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            className="form-control"
                                            value={user.full_name || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <label htmlFor="c_address" className="text-black">Địa chỉ <span
                                            className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="c_address"
                                            className="form-control"
                                            value={formData.c_address || ''}
                                            onChange={handleInputChange}
                                            placeholder="Địa chỉ đường phố"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="d_address"
                                        className="form-control"
                                        value={formData.d_address || ''}
                                        onChange={handleInputChange}
                                        placeholder="Căn hộ, phòng suite, đơn vị, v.v. (tùy chọn)"
                                        required
                                    />
                                </div>

                                <div className="form-group row mb-5">
                                    <div className="col-md-6">
                                        <label htmlFor="c_email_address" className="text-black">Email <span
                                            className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            name="c_email_address"
                                            className="form-control"
                                            value={formData.c_email_address || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="c_phone" className="text-black">Số điện thoại <span
                                            className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="c_phone"
                                            className="form-control"
                                            value={formData.c_phone || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="c_order_notes" className="text-black">Ghi chú</label>
                                    <textarea
                                        name="c_order_notes"
                                        className="form-control"
                                        rows="5"
                                        value={formData.c_order_notes || ''}
                                        onChange={handleInputChange}
                                        placeholder="Viết ghi chú của bạn ở đây..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE - Coupon + Cart Summary */}
                        <div className="col-md-6">
                            <div className="row mb-5">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Mã giảm giá</h2>
                                    <div className="p-3 p-lg-5 border">
                                        <label htmlFor="coupon_code" className="text-black mb-3">Nhập mã giảm giá của
                                            bạn...</label>
                                        <div className="input-group w-75">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="coupon_code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Nhập mã giảm giá"
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    type="button"
                                                    onClick={getCoupon}
                                                >
                                                    Xác nhận
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-5">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Đơn hàng của bạn</h2>
                                    <div className="p-3 p-lg-5 border">
                                        <table className="table site-block-order-table mb-5">
                                            <thead>
                                            <tr>
                                                <th>Sản phẩm</th>
                                                <th>Tổng tiền</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {carts.map((cart, index) => (
                                                <tr key={index}>
                                                    <td><strong>{cart.product_id.title}</strong></td>
                                                    <td>
                                                        <strong>{ConvertCurrency(cart.product_id.sale_price * cart.quantity)}</strong>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className="text-black font-weight-bold"><strong>Tổng cộng giỏ
                                                    hàng</strong></td>
                                                <td className="text-black">{ConvertCurrency(totalProduct)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-black font-weight-bold"><strong>Phí vận
                                                    chuyển</strong></td>
                                                <td className="text-black">{ConvertCurrency(0)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-black font-weight-bold"><strong>Giảm giá</strong>
                                                </td>
                                                <td className="text-black">{ConvertCurrency(discountPrice)}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-black font-weight-bold"><strong>Tổng đơn
                                                    hàng</strong></td>
                                                <td className="text-black font-weight-bold">
                                                    <strong>{ConvertCurrency(total)}</strong></td>
                                            </tr>
                                            </tbody>
                                        </table>

                                        <h4 className="mt-3 mb-2 font-weight-bold">Phương thức thanh toán</h4>

                                        <div className="border p-3 mb-3">
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="order_method"
                                                value="cod"
                                                checked={orderMethod === 'cod'}
                                                onChange={() => setOrderMethod('cod')}
                                            />
                                            <label htmlFor="cod" className="text-black ml-2">Thanh toán khi nhận
                                                hàng</label>
                                        </div>

                                        <div className="border p-3 mb-5">
                                            <input
                                                type="radio"
                                                id="ewallet"
                                                name="order_method"
                                                value="vnpay"
                                                checked={orderMethod === 'vnpay'}
                                                onChange={() => setOrderMethod('vnpay')}
                                            />
                                            <label htmlFor="ewallet" className="text-black ml-2">Thanh toán
                                                online</label>
                                        </div>

                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-lg py-3 btn-block"
                                                    disabled={loading}>
                                                {loading ? 'Đang đặt hàng...' : 'Đặt hàng'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
        <Footer/>
    </div>)
}

export default Checkout