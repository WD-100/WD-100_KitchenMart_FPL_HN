import React from 'react';

function CheckoutForm({
                          formRef,
                          handleCheckout,
                          user,
                          formData,
                          handleInputChange,
                          couponCode,
                          setCouponCode,
                          getCoupon,
                          carts,
                          quickProduct,
                          ConvertCurrency,
                          totalProduct,
                          discountPrice,
                          total,
                          orderMethod,
                          setOrderMethod,
                          loading,
                      }) {

    if (!carts) {
        totalProduct = total = quickProduct.quantity * quickProduct.product_price;
    }

    return (
        <>
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
                                    value={formData.full_name || ''}
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

                    {!carts ? (
                        <>
                        </>
                    ) : (
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
                    )}

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
                                    {!carts ? (
                                        <tr>
                                            <td><strong>{quickProduct.product_name}</strong></td>
                                            <td>
                                                <strong>{ConvertCurrency(quickProduct.quantity * quickProduct.product_price)}</strong>
                                            </td>
                                        </tr>
                                    ) : (
                                        carts.map((cart, index) => (
                                            <tr key={index}>
                                                <td><strong>{cart.product_id.title}</strong></td>
                                                <td>
                                                    <strong>{ConvertCurrency(cart.product_id.sale_price * cart.quantity)}</strong>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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

                                {!carts ? (
                                    <>
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
                                    </>
                                ) : (
                                    <>
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
                                    </>
                                )}

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
        </>
    )
}

export default CheckoutForm
