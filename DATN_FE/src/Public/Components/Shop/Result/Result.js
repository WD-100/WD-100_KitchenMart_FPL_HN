import React, {useEffect, useState, useRef} from 'react';
import {useSearchParams} from 'react-router-dom';
import Header from "../../Shared/Client/Header/Header";
import Footer from "../../Shared/Client/Footer/Footer";
import productService from "../../Service/ProductService";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import categoryService from "../../Service/CategoryService";

function Result() {
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const minPriceRef = useRef(null);
    const maxPriceRef = useRef(null);
    const keywordRef = useRef(null);
    const sizeRef = useRef(null);
    const sortRef = useRef(null);
    const checkboxRefs = useRef({});

    const category_param = searchParams.get('category') ?? '';
    const keyword_param = searchParams.get('keyword') ?? '';
    const size_param = searchParams.get('size') ?? '';
    const sort_param = searchParams.get('sort') ?? '';
    const minPrice_param = searchParams.get('minPrice') ?? '';
    const maxPrice_param = searchParams.get('maxPrice') ?? '';
    const option_param = searchParams.get('option') ?? '';

    const getListProduct = async () => {
        try {
            const res = await productService.searchProduct(
                category_param,
                keyword_param,
                size_param,
                sort_param,
                minPrice_param,
                maxPrice_param,
                option_param
            );
            setNewProducts(res.data.data.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getListCategory = async () => {
        try {
            const res = await categoryService.listCategory();
            setCategories(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const getCheckedOptions = () => {
        return Object.entries(checkboxRefs.current)
            .filter(([_, ref]) => ref?.checked)
            .map(([_, ref]) => ref.value)
            .join(',');
    };

    const searchMainProduct = ({
                                   categoryID,
                                   keywordID,
                                   sizeID,
                                   sortID,
                                   minPriceID,
                                   maxPriceID,
                                   option,
                               }) => {
        const keyword = keywordID ?? keywordRef.current?.value ?? '';
        const size = sizeID ?? sizeRef.current?.value ?? '';
        const sort = sortID ?? sortRef.current?.value ?? '';
        const minPrice = minPriceID ?? minPriceRef.current?.value ?? '';
        const maxPrice = maxPriceID ?? maxPriceRef.current?.value ?? '';
        const category = categoryID ?? category_param ?? '';
        const optionVal = option ?? option_param ?? '';

        const searchUrl = `/products/search?keyword=${keyword}&size=${size}&category=${category}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&option=${optionVal}`;
        window.location.href = searchUrl;
    };

    const filterProduct = () => {
        setLoading(true);
        searchMainProduct({});
    };

    const searchProduct = () => {
        const option = getCheckedOptions();
        searchMainProduct({option});
    };

    const goCategory = (event, id) => {
        event.preventDefault();
        const option = getCheckedOptions();
        searchMainProduct({categoryID: id, option});
    };

    useEffect(() => {
        getListProduct();
        getListCategory();
    }, []);

    let productsPerPage = parseInt(size_param) || 12;
    const totalPages = Math.ceil(newProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = newProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <div className="site-wrap">
            <Header/>
            {/* Breadcrumb */}
            <div className="bg-light py-3">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-0">
                            <a href="/">Trang chủ</a> <span className="mx-2 mb-0">/</span>
                            <strong className="text-black">Cửa hàng</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="site-section">
                <div className="container">
                    <div className="row mb-5">
                        <div className="col-md-9 order-2">
                            <div className="row">
                                <div className="col-md-12 mb-5 d-flex justify-content-between align-items-center">
                                    <h2 className="text-black h5">Toàn bộ sản phẩm</h2>
                                    <div className="d-flex">
                                        <select id="size" className="form-select" ref={sizeRef} onChange={filterProduct}>
                                            <option value="">Tất cả</option>
                                            <option value="3">3</option>
                                            <option value="6">6</option>
                                            <option value="9">9</option>
                                        </select>
                                        <select id="sort" className="form-select ms-3" ref={sortRef} onChange={filterProduct}>
                                            <option value="desc">Từ cao đến thấp</option>
                                            <option value="asc">Từ thấp đến cao</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-5">
                                {currentProducts.map((product, idx) => (
                                    <div className="col-sm-6 col-lg-4 mb-4 productDetail" key={idx}>
                                        <a href={`/products/${product.slug}`} className="block-4 text-center border">
                                            <figure className="block-4-image">
                                                <img
                                                    src={product.image || "/assets/clients/images/no-image.jpg"}
                                                    alt={product.title || "Image placeholder"}
                                                    className="img-fluid"
                                                    style={{width: '100%', height: '300px'}}
                                                />
                                            </figure>
                                            <div className="block-4-text p-4">
                                                <h3>
                                                    <a className="text_truncate_" href={`/products/${product.slug}`}>
                                                        {product.title}
                                                    </a>
                                                </h3>
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

                            {/* Pagination */}
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    <div className="site-block-27">
                                        <ul>
                                            <li>
                                                <a href="#" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>&lt;</a>
                                            </li>
                                            {Array.from({length: totalPages}, (_, i) => (
                                                <li key={i + 1} className={currentPage === i + 1 ? "active" : ""}>
                                                    <a href="#" onClick={() => setCurrentPage(i + 1)}>{i + 1}</a>
                                                </li>
                                            ))}
                                            <li>
                                                <a href="#" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>&gt;</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-md-3 order-1 mb-5 mb-md-0">
                            <div className="border p-4 rounded mb-4">
                                <h3 className="mb-3 h6 text-uppercase text-black d-block">Danh mục</h3>
                                <ul className="list-unstyled mb-0">
                                    {categories.map((category) => (
                                        <li className="mb-1" key={category.id}>
                                            <a href={`/products?category=${category.id}`} onClick={(e) => goCategory(e, category.id)}>
                                                <span>{category.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border p-4 rounded mb-4">
                                <h3 className="mb-3 h6 text-uppercase text-black d-block">Lọc theo giá</h3>
                                <div className="form-group d-flex align-items-center justify-content-between gap-3">
                                    <div className="form-group flex-column d-flex align-items-start justify-content-between gap-3">
                                        {/*<p>Từ: </p>*/}
                                        <input type="number" name="min-price" id="min-price" min="0" className="form-control border"
                                               placeholder="Từ" ref={minPriceRef} />
                                        {/*<p>Đến: </p>*/}
                                        <input type="number" name="max-price" id="max-price" min="1" className="form-control border"
                                               placeholder="Đến" ref={maxPriceRef} />
                                    </div>
                                </div>
                                <button className="btn btn-primary w-100 mt-3" type="button" onClick={searchProduct}>
                                    Áp dụng
                                </button>
                            </div>

                            <div className="border p-4 rounded mb-4">
                                <h3 className="mb-3 h6 text-uppercase text-black d-block">Tùy chọn</h3>
                                <div>
                                    {[1, 2, 3].map(val => (
                                        <div key={val}>
                                            <input
                                                type="checkbox"
                                                value={val}
                                                ref={(el) => (checkboxRefs.current[val] = el)}
                                                className="me-2"
                                            />
                                            Option {val}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Result;
