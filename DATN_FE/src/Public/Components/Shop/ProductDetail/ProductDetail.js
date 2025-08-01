import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Form} from 'antd';
import cartService from '../../Service/CartService';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import {Swiper, SwiperSlide} from "swiper/react";
import {Pagination} from "swiper/modules";
import LoadingPage from "../../Shared/Utils/LoadingPage";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import reviewService from "../../Service/ReviewService";

function ProductDetail() {
    const {slug} = useParams();
    const [product, setProduct] = useState({});
    const [reviews, setReviews] = useState([]);
    const [category, setCategory] = useState(null);
    const [productOthers, setProductOthers] = useState([]);

    const quantityRef = useRef(null);
    const productImageRef = useRef(null);
    const listImagesRef = useRef(null);
    const descriptionRef = useRef(null);
    const btnReadmoreRef = useRef(null);

    useEffect(() => {
        if (!slug) return;

        sessionStorage.removeItem('quick_buy_product');

        const fetchProduct = async () => {
            try {
                const res = await productService.slugProduct(slug);
                const data = res.data.data;
                const product = data.product;

                setProduct(product);
                setCategory(data.categories);
                setProductOthers(data.other_products ?? []);
                renderImage(product.photo_library, product.title);
                fetchReviews(product.id);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchReviews = async (productId) => {
            try {
                const res = await reviewService.getReviewByProduct(productId);
                setReviews(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProduct();
    }, [slug]);

    const renderImage = (images, alt) => {
        if (!listImagesRef.current) return;
        const arr = images.split(',');
        listImagesRef.current.innerHTML = arr.map(img => (
            `<div class="item">
                <img style="cursor: pointer" width="100px" onclick="window.changeSrcImage('${img}')" src="${img}" alt="${alt}" />
            </div>`
        )).join('');
    };

    window.changeSrcImage = (src) => {
        if (productImageRef.current) {
            productImageRef.current.src = src;
        }
    };

    const addToCart = async () => {
        LoadingPage();
        const userId = sessionStorage.getItem('id') || '';
        const quantity = quantityRef.current?.value || '1';

        const data = {
            product_id: product.id,
            user_id: userId,
            quantity: quantity
        };

        try {
            await cartService.createCart(data);
            LoadingPage();
            alert("Thêm sản phẩm vào giỏ hàng thành công!");
        } catch (err) {
            LoadingPage();
            console.error(err.response?.data?.message);
            const state = err.response?.status;
            if (state === 401 || state === 403) {
                alert('Vui lòng đăng nhập để tiếp tục!')
            }
        }
    };

    const quickBuyProduct = async () => {
        const userId = sessionStorage.getItem('id') || '';
        const quantity = quantityRef.current?.value || '1';

        if (quantity > product.quantity) {
            alert('Không đủ số lượng sản phẩm mong muốn!')
            return;
        }

        const data = {
            product_id: product.id,
            product_name: product.title,
            product_image: product.image,
            product_price: product.sale_price,
            user_id: userId,
            quantity: quantity
        };

        try {
            alert("Thành công!");
            sessionStorage.setItem('quick_buy_product', JSON.stringify(data));
            window.location.href = '/checkout';
        } catch (err) {
            LoadingPage();
            console.error(err.response?.data?.message);
            const state = err.response?.status;
            if (state === 401 || state === 403) {
                alert('Vui lòng đăng nhập để tiếp tục!')
            }
        }
    }

    const handleShowDescription = () => {
        if (!descriptionRef.current || !btnReadmoreRef.current) return;
        descriptionRef.current.classList.toggle('show_');
        btnReadmoreRef.current.textContent = descriptionRef.current.classList.contains('show_') ? 'Ẩn bớt' : 'Xem thêm';
    };

    const minusQuantity = () => {
        let qty = parseInt(quantityRef.current?.value || '1');
        if (qty > 1) qty--;
        if (quantityRef.current) quantityRef.current.value = qty;
    };

    const plusQuantity = () => {
        let qty = parseInt(quantityRef.current?.value || '1');
        qty++;
        if (quantityRef.current) quantityRef.current.value = qty;
    };

    const checkInput = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        e.target.value = val;
    };

    return (
        <div className="site-wrap">
            <Header/>
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <a href="/">Trang chủ</a> <span className="mx-2 mb-0">/</span>
                            <strong className="text-black">{product.title}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <Form className="row" onFinish={addToCart}>
                        <input type="text" className="d-none" id="product_option"/>
                        <div className="col-md-6">
                            <img ref={productImageRef} src={product.image} alt="Image" className="img-fluid"
                                 style={{width: '100%', height: '500px'}}/>
                            <div ref={listImagesRef}
                                 className="d-flex align-items-center justify-content-start flex-wrap gap-2 mt-3"></div>
                        </div>

                        <div className="col-md-6">
                            <h2 className="text-black">
                                {product.title}{" "}
                                {product.quantity === 0 && <span className="text-danger ms-3 fw-bold">(ĐÃ HẾT HÀNG)</span>}
                            </h2>
                            <p className="h6 mt-2 mb-2">Danh mục: {category?.name}</p>
                            <p>
                                <strong className="text-danger h4">{ConvertCurrency(product.sale_price)}</strong>
                                <strike className="text-secondary h6 ml-2">{ConvertCurrency(product.price)}</strike>
                            </p>
                            <p className="mb-2">Đang sẵn: <span className="h5">{product.quantity}</span> sản phẩm</p>
                            <div className="mb-2">
                                <div className="input-group mb-3" style={{maxWidth: '150px'}}>
                                    <div className="input-group-prepend">
                                        <button type="button" className="btn btn-outline-primary"
                                                onClick={minusQuantity}>-
                                        </button>
                                    </div>
                                    <input ref={quantityRef} defaultValue="1" min="0" max={product.quantity} type="text"
                                           className="form-control text-center" onInput={checkInput}/>
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-outline-primary"
                                                onClick={plusQuantity}>+
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p>

                                {product.quantity == 0 ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-sm btn-danger mb-2 mt-4"
                                                onClick={() => quickBuyProduct()}>Mua ngay
                                        </button>
                                        <br/>
                                        <button type="submit" className="buy-now btn btn-sm btn-primary">Thêm vào giỏ hàng
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="col-md-12" id="product_description_area_">
                            <p ref={descriptionRef} className="product_description_"
                               dangerouslySetInnerHTML={{__html: product.description}}></p>
                            <button ref={btnReadmoreRef} type="button" onClick={handleShowDescription}
                                    className="btn btn-outline-primary">Xem thêm
                            </button>
                        </div>
                    </Form>

                    <div className="review-section">
                        <h5 className="review-section-title">Đánh giá gần đây</h5>

                        <div className="review-list">
                            {reviews.map((review, index) => (
                                <div key={index} className="review-card">
                                    <div className="review-header">
                                        <img src={review.user.avatar} alt="Avatar" className="review-avatar"/>
                                        <div className="review-user-info">
                                            <span className="review-user-email">{review.user.email}</span>
                                            <div className="review-stars">
                                                {Array.from({length: 5}).map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa-solid fa-star ${i < review.stars ? 'filled-star' : 'empty-star'}`}
                                                    ></i>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="review-body">
                                        <div className="review-title">{review.title}</div>
                                        <div className="review-content">{review.content}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section block-3 site-blocks-2 bg-light">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-7 site-section-heading text-center pt-4">
                            <h2>Sản phẩm liên quan</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={30}
                                pagination={{clickable: true}}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                {productOthers.length > 0 ? productOthers.map((p, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="item">
                                            <div className="block-4 text-center">
                                                <figure className="block-4-image">
                                                    <img
                                                        src={p.thumbnail || "/assets/clients/images/cloth_1.jpg"}
                                                        alt={p.name || "Image placeholder"}
                                                        className="img-fluid"
                                                        style={{width: '100%', height: '300px'}}
                                                    />
                                                </figure>
                                                <div className="block-4-text p-4" style={{height: '180px'}}>
                                                    <h3><a className="text_truncate_"
                                                           href={`/products/${p.id}`}>{p.name || "Product Name"}</a>
                                                    </h3>
                                                    <p className="mb-0 text_truncate_2_" style={{height: '55px'}}
                                                       dangerouslySetInnerHTML={{__html: p.short_description}}></p>
                                                    <p className="text-danger font-weight-bold">
                                                        {ConvertCurrency(p.sale_price || 50)}
                                                        <strike
                                                            className="ml-2 small text-black">{ConvertCurrency(p.price || 50)}</strike>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                )) : <p>No products available</p>}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default ProductDetail;