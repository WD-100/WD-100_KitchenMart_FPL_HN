import React, {useEffect, useState} from 'react';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import cartService from "../Service/CartService";
import ConvertCurrency from "../Shared/Utils/ConvertCurrency";
import {message} from "antd";
import {useCart} from "../store/CartContext";

/**
 * The cart page component.
 *
 * This component displays the cart page, showing all the products in the cart
 * and the total price. It also allows the user to update the cart, apply a coupon
 * and proceed to checkout.
 *
 * @returns {JSX.Element} The cart page component.
 */
function Cart() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const {setCartCount} = useCart();

    const getListProductCart = async () => {
        try {
            const res = await cartService.listCart();
            setCarts(res.data.data);
        } catch (err) {
            console.error('Error fetching cart:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQty) => {
        try {
            const res = await cartService.updateCart(cartId, {quantity: newQty});
            const updatedItem = res.data.data;
            setCarts(prev =>
                prev.map(item =>
                    item._id === cartId ? {...item, quantity: updatedItem.quantity} : item
                )
            );
        } catch (err) {
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật số lượng');
            if ([401, 444].includes(err.response?.status)) {
                window.location.href = '/login';
            }
        }
    };

    const handlePlus = async (cartId) => {
        const cartItem = carts.find(item => item._id === cartId);
        if (!cartItem) return;
        const newQty = cartItem.quantity + 1;
        await updateQuantity(cartId, newQty);
    };

    const handleMinus = async (cartId) => {
        const cartItem = carts.find(item => item._id === cartId);
        if (!cartItem || cartItem.quantity <= 1) return;
        const newQty = cartItem.quantity - 1;
        await updateQuantity(cartId, newQty);
    };

    const handleInputChange = (e, cartId) => {
        const value = e.target.value.replace(/\D/g, '');
        setCarts(prev =>
            prev.map(item =>
                item._id === cartId ? {...item, quantity: Number(value || 1)} : item
            )
        );
    };

    const handleInputBlur = async (cartId) => {
        const cartItem = carts.find(item => item._id === cartId);
        if (cartItem) {
            await updateQuantity(cartId, cartItem.quantity);
        }
    };

    const removeFromCart = async (cartId) => {
        if (!window.confirm('Bạn chắc chắn muốn xoá sản phẩm khỏi giỏ hàng?')) return;
        try {
            await cartService.deleteCart(cartId);
            setCarts(prev => {
                const updated = prev.filter(item => item._id !== cartId);
                setCartCount(updated.length);
                return updated;
            });
            message.success('Xóa sản phẩm khỏi giỏ hàng thành công!');
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const clearCart = async () => {
        if (!window.confirm('Bạn chắc chắn muốn làm trống giỏ hàng?')) return;
        try {
            await cartService.clearCart();
            setCarts([]);
            setCartCount(0);
            message.success('Làm trống giỏ hàng thành công!');
        } catch (err) {
            console.error('Error clearing cart:', err);
        }
    };

    const total = carts.reduce(
        (sum, item) => sum + item.value.sale_price * item.quantity,
        0
    );

    useEffect(() => {
        getListProductCart();
    }, []);

    return (
        <div className="site-wrap">
            <Header/>
            <div className="site-section">
                <div className="container">
                    {carts.length === 0 ? (
                        <p className="text-center">Giỏ hàng của bạn hiện đang trống.</p>
                    ) : (
                        <table className="table table-bordered">
                            <colgroup>
                                <col width="15%"/>
                                <col width="x"/>
                                <col width="10%"/>
                                <col width="15%"/>
                                <col width="10%"/>
                                <col width="5%"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>Hình ảnh</th>
                                <th>Sản phẩm</th>
                                <th>Giá</th>
                                <th>Số lượng</th>
                                <th>Thành tiền</th>
                                <th>Xoá</th>
                            </tr>
                            </thead>
                            <tbody>
                            {carts.map(cart => (
                                <tr key={cart._id}>
                                    <td>
                                        <img src={cart.product_id.image} alt="" className="img-fluid"/>
                                    </td>
                                    <td>
                                        {cart.product_id.title}
                                        <div className="d-flex align-items-center justify-content-start">
                                            <p>Loại: {cart.value.attribute_id.name}</p>
                                        </div>
                                    </td>
                                    <td>{ConvertCurrency(cart.value.sale_price)}</td>
                                    <td>
                                        <div className="input-group">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handleMinus(cart._id)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="text"
                                                className="form-control text-center"
                                                value={cart.quantity}
                                                onChange={(e) => handleInputChange(e, cart._id)}
                                                onBlur={() => handleInputBlur(cart._id)}
                                                style={{width: '60px'}}
                                            />
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => handlePlus(cart._id)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>{ConvertCurrency(cart.value.sale_price * cart.quantity)}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => removeFromCart(cart._id)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}

                    {/* Cart Actions */}
                    {carts.length > 0 && (
                        <div className="row mt-4">
                            <div className="col-md-6">
                                <button className="btn btn-danger btn-sm" onClick={clearCart}>
                                    Làm trống giỏ hàng
                                </button>
                                <a href="/products" className="btn btn-outline-primary btn-sm ml-2">
                                    Tiếp tục mua sắm
                                </a>
                            </div>
                            <div className="col-md-6 text-right">
                                <h4>Tổng cộng: {ConvertCurrency(total)}</h4>
                                <a href="/checkout" className="btn btn-primary btn-lg mt-2">
                                    Tiến hành thanh toán
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Cart;
