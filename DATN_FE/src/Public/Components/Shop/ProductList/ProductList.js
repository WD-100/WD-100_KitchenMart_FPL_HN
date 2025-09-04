import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import categoryService from "../../Service/CategoryService";

function ProductList() {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const minPriceRef = useRef(null);
    const maxPriceRef = useRef(null);
    const keywordRef = useRef(null);
    const sizeSelectRef = useRef(null);
    const sortSelectRef = useRef(null);

    const category_param = searchParams.get('category') ?? '';
    const keyword_param = searchParams.get('keyword') ?? '';
    const size_param = searchParams.get('size') ?? '';
    const sort_param = searchParams.get('sort') ?? '';
    const minPrice_param = searchParams.get('minPrice') ?? '';
    const maxPrice_param = searchParams.get('maxPrice') ?? '';
    const option_param = searchParams.get('option') ?? '';

    let productsPerPage = parseInt(size_param);
    if (isNaN(productsPerPage) || productsPerPage <= 0) productsPerPage = 12;

    let totalPages = Math.ceil(newProducts.length / productsPerPage);
    let indexOfLastProduct = currentPage * productsPerPage;
    let indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    let currentProducts = newProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    useEffect(() => {
        if (minPriceRef.current) minPriceRef.current.value = minPrice_param;
        if (maxPriceRef.current) maxPriceRef.current.value = maxPrice_param;
        if (keywordRef.current) keywordRef.current.value = keyword_param;
    }, [minPrice_param, maxPrice_param, keyword_param]);

    const getListProduct = async () => {
        try {
            const res = await productService.listProduct('', sort_param);
            setNewProducts(res.data.data.products);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getListCategory = async () => {
        try {
            const res = await categoryService.listCategory();
            setCategories(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const buildSearchUrl = (
        categoryID = category_param,
        keywordID = keywordRef.current?.value,
        sizeID = size_param,
        sortID = sort_param,
        minPriceID = minPriceRef.current?.value ?? '',
        maxPriceID = maxPriceRef.current?.value ?? '',
        option = option_param
    ) => {
        return `/products/search?keyword=${keywordID}&size=${sizeID}&category=${categoryID}&sort=${sortID}&minPrice=${minPriceID}&maxPrice=${maxPriceID}&option=${option}`;
    };

    const handleClick = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    const sortProduct = (event) => {
        event.preventDefault();
        const sortVal = sortSelectRef.current?.value ?? '';
        const sizeVal = sizeSelectRef.current?.value ?? '';
        const base = window.location.href.split('?')[0];
        window.location.href = `${base}?sort=${sortVal}&size=${sizeVal}`;
    };

    const searchProduct = () => {
        let option = '';
        document.querySelectorAll('.property_val:checked').forEach((el) => {
            option += el.value + ',';
        });
        window.location.href = buildSearchUrl(undefined, undefined, undefined, undefined, undefined, undefined, option);
    };

    const goCategory = (event, id) => {
        event.preventDefault();
        let option = '';
        document.querySelectorAll('.property_val:checked').forEach((el) => {
            option += el.value + ',';
        });
        window.location.href = buildSearchUrl(id, undefined, undefined, undefined, undefined, undefined, option);
    };

    useEffect(() => {
        getListProduct();
        getListCategory();
    }, []);

    return (
        <div className="site-wrap">
            <Header />
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <a href="/">Trang chủ</a> <span className="mx-2 mb-0">/</span> <strong className="text-black">Cửa hàng</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="site-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-9 order-2">
                            <div className="row">
                                <div className="col-md-12 mb-5">
                                    <div className="float-md-left mb-4">
                                        <h2 className="text-black h5">Toàn bộ sản phẩm</h2>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="btn-group">
                                            <select ref={sizeSelectRef} id="size" className="form-select" onChange={sortProduct}>
                                                <option value="">Tất cả</option>
                                                <option value="3">3</option>
                                                <option value="6">6</option>
                                                <option value="9">9</option>
                                            </select>
                                        </div>
                                        <div className="btn-group ms-3">
                                            <select ref={sortSelectRef} id="sort" className="form-select" onChange={sortProduct}>
                                                <option value="desc">Từ cao đến thấp</option>
                                                <option value="asc">Từ thấp đến cao</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-5">
                                {currentProducts.map((product) => (
                                    <div className="col-sm-6 col-lg-4 mb-4 productDetail" key={product._id}>
                                        <a href={`/products/${product.slug}`} className="block-4 text-center border">
                                            <figure className="block-4-image">
                                                <img
                                                    src={product.image || "/assets/clients/images/no-image.jpg"}
                                                    alt={product.title || "Image placeholder"}
                                                    className="img-fluid"
                                                    style={{ width: '100%', height: '300px' }}
                                                />
                                            </figure>
                                            <div className="block-4-text p-4">
                                                <h3><a className="text_truncate_" href={`/products/${product.slug}`}>{product.title}</a></h3>
                                                <p className="text-danger font-weight-bold">
                                                    {ConvertCurrency(product.sale_price || 0)}
                                                    <strike className="ml-2 small text-black">
                                                        {ConvertCurrency(product.price || 0)}
                                                    </strike>
                                                </p>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>

                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <div className="site-block-27">
                                        <ul>
                                            <li><a href="#" onClick={() => handleClick(currentPage - 1)}>&lt;</a></li>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <li key={i + 1} className={currentPage === i + 1 ? "active" : ""}>
                                                    <a href="#" onClick={() => handleClick(i + 1)}>{i + 1}</a>
                                                </li>
                                            ))}
                                            <li><a href="#" onClick={() => handleClick(currentPage + 1)}>&gt;</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-3 order-1 mb-5 mb-md-0">
                            <div className="border p-4 rounded mb-4">
                                <h3 className="mb-3 h6 text-uppercase text-black d-block">Danh mục</h3>
                                <ul className="list-unstyled mb-0">
                                    {categories.map((category) => (
                                        <li className="mb-1" key={category.id}>
                                            <a href={`/products?category=${category.id}`} className={`d-flex category${category_param}`} onClick={(e) => goCategory(e, category.id)}>
                                                <span>{category.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border p-4 rounded mb-4">
                                <div className="mb-4">
                                    <h3 className="mb-3 h6 text-uppercase text-black d-block">Lọc theo giá</h3>
                                    <div className="form-group flex-column d-flex align-items-start justify-content-between gap-3">
                                        {/*<p>Từ: </p>*/}
                                        <input type="number" name="min-price" id="min-price" min="0" className="form-control border"
                                               placeholder="Từ" ref={minPriceRef} />
                                        {/*<p>Đến: </p>*/}
                                        <input type="number" name="max-price" id="max-price" min="1" className="form-control border"
                                               placeholder="Đến" ref={maxPriceRef} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <button className="btn btn-primary w-100" type="button" onClick={searchProduct}>Áp dụng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ProductList;