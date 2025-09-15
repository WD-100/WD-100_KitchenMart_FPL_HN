import React from 'react';
import Header from "../Shared/Client/Header/Header";
import Footer from "../Shared/Client/Footer/Footer";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

function About() {
    return (<div className="site-wrap">
        <Header />
        <div className="bg-light py-3">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mb-0"><a href="/">Trang chủ</a> <span
                        className="mx-2 mb-0">/</span> <strong className="text-black">Về chúng tôi</strong></div>
                </div>
            </div>
        </div>

        <div className="site-section border-bottom">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md-6">
                        <div className="block-16">
                            <figure>
                                <img src="/assets/clients/images/image_banner_v1.jpg" alt="Image placeholder"
                                    className="img-fluid rounded" />
                                <a href="https://vimeo.com/channels/staffpicks/93951774"
                                    className="play-button popup-vimeo d-flex align-items-center justify-content-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                                    </svg>
                                </a>
                            </figure>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-5">
                        <div className="site-section-heading pt-3 mb-4">
                            <h2 className="text-black">KitchenMart - Giải pháp đa dụng cho cuộc sống tiện nghi</h2>
                        </div>

                        <p>KitchenMart là nơi hội tụ các sản phẩm đa dụng, từ dụng cụ nhà bếp thông minh đến đồ gia dụng
                            tiện ích. Chúng tôi cam kết mang đến cho bạn những sản phẩm chất lượng, giúp tối ưu hóa
                            không gian sống và công việc nội trợ hàng ngày.</p>

                        <p>Với KitchenMart, sự tiện nghi không chỉ là nhu cầu mà còn là phong cách sống. Tại đây, bạn sẽ
                            tìm thấy những giải pháp hiện đại, thiết kế thông minh và đa dạng, phù hợp với mọi gia đình,
                            giúp cuộc sống trở nên dễ dàng và thoải mái hơn.</p>
                    </div>
                </div>

                <div className="row mb-5">
                    <div className="col-md-5">
                        <div className="site-section-heading pt-3 mb-4">
                            <h2 className="text-black">KitchenMart - Đẳng cấp của sự tiện nghi</h2>
                        </div>

                        <p>
                            KitchenMart là điểm đến lý tưởng cho những ai mong muốn nâng tầm không gian sống. Với bộ sưu
                            tập sản phẩm đa dạng, chất lượng cao và thiết kế thông minh, chúng tôi mang đến giải pháp
                            tiện ích giúp bạn tối ưu hóa cuộc sống hàng ngày.
                        </p>
                        <p>
                            Bước vào thế giới sản phẩm của KitchenMart, bạn sẽ khám phá những món đồ không chỉ hữu dụng
                            mà còn tinh tế về mặt thẩm mỹ. Chúng tôi giúp bạn tạo dựng một không gian sống hiện đại,
                            sang trọng và đầy tiện nghi – nơi mọi chi tiết đều phục vụ sự thoải mái và hiệu quả.
                        </p>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-6">
                        <div className="block-16">
                            <figure>
                                <img src="/assets/clients/images/image_banner_v2.jpg" alt="Image placeholder"
                                    className="img-fluid rounded" />
                                <a href="https://vimeo.com/channels/staffpicks/93951774"
                                    className="play-button popup-vimeo d-flex align-items-center justify-content-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                                        className="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                        <path
                                            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                                    </svg>
                                </a>
                            </figure>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="site-section site-section-sm site-blocks-1 border-0">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                        <div className="icon mr-4 align-self-start">
                            <span className="icon-truck"></span>
                        </div>
                        <div className="text">
                            <h2 className="text-uppercase">Miễn phí giao hàng</h2>
                            <p>
                                Với KitchenMart, mua sắm chưa bao giờ dễ dàng đến thế! Dù bạn ở bất cứ đâu, chỉ cần
                                chọn sản phẩm, chúng tôi sẽ giao tận tay bạn mà không tốn thêm bất kỳ chi phí
                                nào.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                        <div className="icon mr-4 align-self-start">
                            <span className="icon-refresh2"></span>
                        </div>
                        <div className="text">
                            <h2 className="text-uppercase">Miễn phí đổi trả</h2>
                            <p>
                                Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi. Nếu sản phẩm không vừa ý, bạn
                                có thể đổi trả hoàn toàn miễn phí trong vòng 30 ngày, giúp bạn tự tin hơn khi chọn
                                lựa.
                            </p>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 d-lg-flex mb-4 mb-lg-0 pl-4">
                        <div className="icon mr-4 align-self-start">
                            <span className="icon-help"></span>
                        </div>
                        <div className="text">
                            <h2 className="text-uppercase">Hỗ trợ khách hàng</h2>
                            <p>
                                Đội ngũ chăm sóc khách hàng của KitchenMart luôn sẵn sàng lắng nghe và hỗ trợ mọi thắc
                                mắc của bạn 24/7. Chúng tôi đảm bảo bạn được mua
                                sắm thoải mái và hoàn toàn hài lòng.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>)
}

export default About
