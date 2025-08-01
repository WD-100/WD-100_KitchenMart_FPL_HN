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
import CheckoutForm from "./CheckoutForm";

function Checkout() {
    const [loading, setLoading] = useState(true);
    const [carts, setCarts] = useState([]);
    const [user, setUser] = useState(null);
    const [coupon, setCoupon] = useState(null);
    const [quick_buy_product, setQuickBuyProduct] = useState(null);
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
            navigate('/login');
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
        if (!couponCode.trim()) return alert('Vui lòng nhập mã giảm giá');
        setLoading(true);
        try {
            const res = await couponService.searchMyCoupon(couponCode.trim());
            if (res.status === 200 && res.data.data.length > 0) {
                const foundCoupon = res.data.data[0];
                const coupon = foundCoupon.coupon_id;
                validateAndApplyCoupon(coupon);
            } else {
                alert('Không tìm thấy mã giảm giá hợp lệ');
            }
        } catch (err) {
            console.error(err);
            alert('Không tìm thấy mã giảm giá hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    const validateAndApplyCoupon = (coupon) => {
        const minTotal = Number(coupon.min_order_value);
        if (totalProduct < minTotal) {
            alert(`Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã: ${ConvertCurrency(minTotal)}`);
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

    useEffect(() => {
        const p = sessionStorage.getItem('quick_buy_product');
        if (p){
            setQuickBuyProduct(JSON.parse(p));
        }
    }, []);

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
                alert(`${field} không được bỏ trống!`);
                return;
            }
        }

        let data = {
            ...formData,
            order_method: orderMethod === 'cod' ? 'IMMEDIATE' : 'CARD_CREDIT',
            coupon_id: coupon?.id || null,
            c_total_product: totalProduct,
            c_discount_price: discountPrice,
            c_total: total
        };

        if (quick_buy_product) {
            if (quick_buy_product) {
                data = {
                    ...data,
                    ...quick_buy_product,
                };
            }
        }

        setLoading(true);

        try {
            if (orderMethod === 'cod') {
                if (quick_buy_product) {
                    const res = await orderService.createQuickOrder(data);
                    sessionStorage.removeItem('quick_buy_product');
                    console.log('Đặt hàng thành công:', res.data);
                } else {
                    const res = await orderService.createOrder(data);
                    console.log('Đặt hàng thành công:', res.data);
                }
                navigate('/thanks-you');
            } else {
                const res = await orderService.createOrderVnpay(data);
                localStorage.setItem('order_info', JSON.stringify(data));
                window.location.href = res.data.data;
            }
        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            alert(err.response.data.message ?? 'Đã xảy ra lỗi khi đặt hàng!');
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
                {quick_buy_product ? (
                    <>
                        <CheckoutForm
                            formRef={formRef}
                            handleCheckout={handleCheckout}
                            user={user}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            couponCode={couponCode}
                            setCouponCode={setCouponCode}
                            getCoupon={getCoupon}
                            carts={null}
                            quickProduct={quick_buy_product}
                            ConvertCurrency={ConvertCurrency}
                            totalProduct={totalProduct}
                            discountPrice={discountPrice}
                            total={total}
                            orderMethod={orderMethod}
                            setOrderMethod={setOrderMethod}
                            loading={loading}
                        />
                    </>
                ) : (
                    carts.length === 0 ? (
                        <div className="text-center">
                            <p>Giỏ hàng của bạn hiện đang trống.</p>
                        </div>
                    ) : (
                        <>
                            <CheckoutForm
                                formRef={formRef}
                                handleCheckout={handleCheckout}
                                user={user}
                                formData={formData}
                                handleInputChange={handleInputChange}
                                couponCode={couponCode}
                                setCouponCode={setCouponCode}
                                getCoupon={getCoupon}
                                carts={carts}
                                quickProduct={null}
                                ConvertCurrency={ConvertCurrency}
                                totalProduct={totalProduct}
                                discountPrice={discountPrice}
                                total={total}
                                orderMethod={orderMethod}
                                setOrderMethod={setOrderMethod}
                                loading={loading}
                            />
                        </>
                    )
                )}
            </div>
        </div>
        <Footer/>
    </div>)
}

export default Checkout
