import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="site-footer border-top">
            <div className="container">
                <div className="row">
                    {/* Điều hướng nhanh */}
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <div className="row">
                            <div className="col-md-12">
                                <h3 className="footer-heading mb-4">Điều hướng nhanh</h3>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="/products">Sản phẩm</Link></li>
                                    <li><Link to="/about-us">Về KitchenMart</Link></li>
                                    <li><Link to="/contacts">Liên hệ</Link></li>
                                    <li><Link to="/coupons">Mã giảm giá</Link></li>
                                </ul>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="#">Đồ gia dụng nhà bếp</Link></li>
                                    <li><Link to="#">Thiết bị nấu ăn</Link></li>
                                    <li><Link to="#">Bộ nồi chảo cao cấp</Link></li>
                                </ul>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <ul className="list-unstyled">
                                    <li><Link to="#">Khuyến mãi nổi bật</Link></li>
                                    <li><Link to="#">Bài viết hữu ích</Link></li>
                                    <li><Link to="#">Hướng dẫn sử dụng</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Khuyến mãi nổi bật */}
                    <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
                        <h3 className="footer-heading mb-4">Khuyến mãi nổi bật</h3>
                        <Link to="#" className="block-6">
                            <img src="/assets/clients/images/promo_kitchen.jpg" alt="Khuyến mãi đồ gia dụng"
                                className="img-fluid rounded mb-4" />
                            <h3 className="font-weight-light mb-0">Bộ dụng cụ nấu ăn Elmich cao cấp - giảm giá 25%</h3>
                            <p>Áp dụng từ 20/07/2024 đến 31/07/2024</p>
                        </Link>
                    </div>

                    {/* Thông tin liên hệ + Đăng ký */}
                    <div className="col-md-6 col-lg-3">
                        <div className="block-5 mb-5">
                            <h3 className="footer-heading mb-4">Thông tin liên hệ</h3>
                            <ul className="list-unstyled">
                                <li className="address">Số 12, Đường Cầu Diễn, Bắc Từ Liêm, Hà Nội</li>
                                <li className="phone"><a href="tel://0989888888">+84 989 888 888</a></li>
                                <li className="email">hotro@kitchenmart.com</li>
                            </ul>
                        </div>

                        <div className="block-7">
                            <form action="#" method="post">
                                <label htmlFor="email_subscribe" className="footer-heading">Đăng ký nhận tin</label>
                                <div className="form-group">
                                    <input type="text" className="form-control py-4" id="email_subscribe"
                                        placeholder="Nhập email của bạn" />
                                    <input type="submit" className="btn btn-sm btn-primary mt-2" value="Gửi" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bản quyền */}
                <div className="row pt-5 mt-5 text-center">
                    <div className="col-md-12">
                        <p>
                            &copy; 2024 KitchenMart. Bảo lưu mọi quyền. Thiết kế bởi
                            <Link to="#" className="text-primary"> KitchenMart Team</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer
