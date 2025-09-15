import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, message } from 'antd';
import cartService from '../../Service/CartService';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import LoadingPage from "../../Shared/Utils/LoadingPage";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import reviewService from "../../Service/ReviewService";
import { useCart } from "../../store/CartContext";

function ProductDetail() {
    const { setCartCount } = useCart();

    const { slug } = useParams();
    const [product, setProduct] = useState({});
    const [reviews, setReviews] = useState([]);
    const [category, setCategory] = useState(null);
    const [productOthers, setProductOthers] = useState([]);
    const [optionsProduct, setOptionsProduct] = useState([]);
    const [option, setOption] = useState(null);
    const [optionSelected, setOptionSelected] = useState(null);
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
                await fetchReviews(product.id);
                await fetchProductOptions(product.id);
            } catch (err) {
            }
        };

        const fetchReviews = async (productId) => {
            try {
                const res = await reviewService.getReviewByProduct(productId);
                setReviews(res.data.data);
            } catch (err) {
            }
        };

        const fetchProductOptions = async (productId) => {
            try {
                const res = await productService.listOptionProduct(productId);
                setOptionsProduct(res.data);
            } catch (err) {
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
        if (!optionSelected) {
            message.error('Vui lòng chọn thuộc tính sản phẩm!')
            return false;
        }
        LoadingPage();
        const userId = sessionStorage.getItem('id') || '';
        const quantity = quantityRef.current?.value || '1';
        if (quantity > option.quantity) {
            LoadingPage();
            message.error('Không đủ số lượng sản phẩm mong muốn!');
            return false;
        }
        const data = {
            product_id: product.id,
            value: optionSelected,
            user_id: userId,
            quantity: quantity
        };

        try {
            await cartService.createCart(data);
            LoadingPage();
            message.success('Thêm sản phẩm vào giỏ hàng thành công!');
            const res = await cartService.listCart();
            setCartCount(res.data.data.length);
        } catch (err) {
            LoadingPage();
            const state = err.response?.status;
            if (state === 401 || state === 403) {
                message.error('Vui lòng đăng nhập để tiếp tục!');
            }
            message.error(err.response?.message ?? 'Đã xảy ra lỗi!');
        }
    };

    const quickBuyProduct = async () => {
        if (!optionSelected) {
            message.error('Vui lòng chọn thuộc tính sản phẩm!')
            return false;
        }

        const userId = sessionStorage.getItem('id') || '';
        const quantity = quantityRef.current?.value || '1';

        if (quantity > option.quantity) {
            message.error('Không đủ số lượng sản phẩm mong muốn!');
            return;
        }

        const data = {
            product_id: product.id,
            product_value: optionSelected,
            product_name: product.title,
            product_image: product.image,
            product_price: option.sale_price,
            user_id: userId,
            quantity: quantity
        };

        try {
            message.success('Thêm sản phẩm vào giỏ hàng thành công!');
            sessionStorage.setItem('quick_buy_product', JSON.stringify(data));
            window.location.href = '/checkout';
        } catch (err) {
            LoadingPage();
            const state = err.response?.status;
            if (state === 401 || state === 403) {
                message.error('Vui lòng đăng nhập để tiếp tục!');
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

    const selectOption = async (el, id) => {
        const res = await productService.detailOptionProduct(id);
        setOption(res.data);

        setOptionSelected(id);
    }

    return (
        <div className="site-wrap">
            <Header />
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
                        <input type="text" className="d-none" id="product_option" />
                        <div className="col-md-6">
                            <img ref={productImageRef} src={product.image} alt="Image" className="img-fluid"
                                style={{ width: '100%', height: '500px' }} />
                            <div ref={listImagesRef}
                                className="d-flex align-items-center justify-content-start flex-wrap gap-2 mt-3"></div>
                        </div>

                        <div className="col-md-6">
                            <h2 className="text-black">
                                {product.title}{" "}
                                {product.quantity === 0 &&
                                    <span className="text-danger ms-3 fw-bold">(ĐÃ HẾT HÀNG)</span>}
                            </h2>
                            <p className="h6 mt-2 mb-2">Danh mục: {category?.name}</p>
                            <p>
                                <strong
                                    className="text-danger h4">{option ? ConvertCurrency(option.sale_price) : ConvertCurrency(product.sale_price)}</strong>
                                <strike
                                    className="text-secondary h6 ml-2">{option ? ConvertCurrency(option.price) : ConvertCurrency(product.price)}</strike>
                            </p>
                            <p className="mb-2">Đang sẵn: <span
                                className="h5">{option ? option.quantity : product.quantity}</span> sản phẩm</p>
                            <div className="list_option_ mt-4">
                                {optionsProduct.map((option, optionIndex) => (
                                    <div className="option_item" key={optionIndex}>
                                        <div className="mb-1 d-flex">
                                            <label htmlFor={`option-${option.id}`} className="d-flex mb-1"
                                                key={optionIndex}>
                                                <span className="d-inline-block mr-2"
                                                    style={{ top: '0px', position: 'relative' }}>
                                                    <input type="radio"
                                                        onChange={(e) => selectOption(e.target, option.id)}
                                                        className="input_option_"
                                                        data-value={option.id}
                                                        value={option.id}
                                                        id={`option-${option.id}`}
                                                        name="option_product" />
                                                </span>
                                                <span
                                                    className="d-inline-block text-black">{option.attribute_id.name}</span>
                                            </label>
                                        </div>
                                    </div>))}

                            </div>
                            <div className="mb-2">
                                <div className="input-group mb-3" style={{ maxWidth: '150px' }}>
                                    <div className="input-group-prepend">
                                        <button type="button" className="btn btn-outline-primary"
                                            onClick={minusQuantity}>-
                                        </button>
                                    </div>
                                    <input ref={quantityRef} defaultValue="1" min="0" max={product.quantity} type="text"
                                        className="form-control text-center" onInput={checkInput} />
                                    <div className="input-group-append">
                                        <button type="button" className="btn btn-outline-primary"
                                            onClick={plusQuantity}>+
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p>
                                {(option ? option.quantity : product.quantity) == 0 ? (
                                    <>

                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn btn-sm btn-danger mb-2 mt-4"
                                            onClick={() => quickBuyProduct()}>Mua ngay
                                        </button>
                                        <br />
                                        <button type="submit" className="buy-now btn btn-sm btn-primary">Thêm vào giỏ
                                            hàng
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>

                        <div className="col-md-12" id="product_description_area_">
                            <p ref={descriptionRef} className="product_description_"
                                dangerouslySetInnerHTML={{ __html: product.description }}></p>
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
                                        <img src={review.user.avatar} alt="Avatar" className="review-avatar" />
                                        <div className="review-user-info">
                                            <span className="review-user-email">{review.user.email}</span>
                                            <div className="review-stars">
                                                {Array.from({ length: 5 }).map((_, i) => (
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
                                        <img src={review.thumbnail}
                                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                        />
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
                                pagination={{ clickable: true }}
                                modules={[Pagination]}
                                className="mySwiper"
                            >
                                {productOthers.length > 0 ? productOthers.map((p, i) => (
                                    <SwiperSlide key={i}>
                                        <div className="item">
                                            <a href={`/products/${p.slug}`} className="block-4 text-center">
                                                <figure className="block-4-image">
                                                    <img
                                                        src={p.image || "/assets/clients/images/no-image.jpg"}
                                                        alt={p.title || "Image placeholder"}
                                                        className="img-fluid"
                                                        style={{ width: '100%', height: '300px', }}
                                                    />
                                                </figure>
                                                <div className="block-4-text p-4">
                                                    <h3><a className="text_truncate_"
                                                        href={'/products/' + p.slug}>{p.title || "Product Name"}</a>
                                                    </h3>
                                                    <p className="text-danger font-weight-bold">
                                                        {ConvertCurrency(p.sale_price || 0)}
                                                        <strike className="ml-2 small text-black">
                                                            {ConvertCurrency(p.price || 0)}
                                                        </strike>
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                    </SwiperSlide>
                                )) : <p>Không tìm thấy sản phẩm liên quan</p>}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductDetail;