import {Form, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import productService from '../../../Service/ProductService';
import categoryService from '../../../Service/CategoryService';
import $ from "jquery";
import {API_KEY_TINYMCE} from "../../../config/Constants";
import {Editor} from "@tinymce/tinymce-react";
import uploadService from "../../../Service/UploadService";

/**
 * Renders a page that displays the details of a product.
 * The page provides a form for editing the product.
 * The form includes fields for the product name, price, quantity, description, image, category, and status.
 * The page uses the `productService` to fetch the details of the product from the server.
 * The page also uses the `categoryService` to fetch the list of categories from the server.
 * The page uses the `useState` hook to store the list of categories and the table parameters in the component state.
 * The page uses the `useCallback` hook to memoize the function that fetches the list of categories.
 * The page uses the `useCallback` hook to memoize the function that handles the change event of the table.
 * The page uses the `useEffect` hook to fetch the list of categories when the component mounts.
 * The page uses the `useEffect` hook to fetch the details of the product when the component mounts.
 * The page also uses the `useEffect` hook to update the component state when the user navigates to a different product.
 * @returns {ReactElement} A React element that represents the page.
 * @function
 */
function UpdateProduct() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [product, setProduct] = useState([]);
    const [categories, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);
    const [hot, setHot] = useState(false);

    const getProduct = async () => {
        await productService.adminDetailProduct(id)
            .then((res) => {
                const product = res.data.data.product;
                setProduct(product)
                setLoading(false)
                renderImage(product.photo_library, product.title)
                setImageUrl(product.image)
                setImageUrls(product.photo_library)
                setHot(product.is_hot)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const getListCategory = async () => {
        await categoryService.adminListCategory()
            .then((res) => {
                setData(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    function renderImage(images, alt) {
        let arr = images.split(',');
        let html = '';
        for (let i = 0; i < arr.length; i++) {
            html += `<div class="item">
          <img width="100px" src="${arr[i]}" alt="${alt}">
        </div>`;
        }

        $('#list_images').empty().append(html);
    }

    const onFinish = async () => {
        setLoading(true)
        $('#btnSave').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdate input, #formUpdate textarea, #formUpdate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file') {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
                setLoading(false);
                return;
            }
        }

        const formData = new FormData($('#formUpdate')[0]);

        const shortDescriptionContent = shortDescriptionRef.current.getContent();
        const descriptionContent = descriptionRef.current.getContent();

        if (!shortDescriptionContent) {
            message.error('Mô tả ngắn không được bỏ trống!');
            setLoading(false);
            return;
        }
        if (!descriptionContent) {
            message.error('Mô tả không được bỏ trống!');
            setLoading(false);
            return;
        }

        formData.append('short_description', shortDescriptionContent);
        formData.append('description', descriptionContent);
        formData.append('image', imageUrl);
        formData.append('photo_library', imageUrls);

        formData.delete('gallery');
        formData.delete('thumbnail');

        formData.set('is_hot', hot);

        await productService.adminUpdateProduct(id, formData)
            .then((res) => {
                setLoading(false)
                console.log(res)
                message.success("Thay đổi thành công")
                navigate("/admin/products/list")
            })
            .catch((err) => {
                setLoading(false);
                console.log(err)
                $('#btnSave').prop('disabled', false).text('Lưu thay đổi');
            })
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            await uploadImage(selectedFile);
        }
    };

    const uploadImage = async (file) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await uploadService.upload(formData);
            const imageUrl = res.data.imageUrl;
            setImageUrl(imageUrl);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChangeMultiple = async (event) => {
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('image', files[i]);
        }

        await uploadMultipleImage(formData);
    };

    const uploadMultipleImage = async (formData) => {
        setLoading(true);

        try {
            const res = await uploadService.multiple(formData);
            const imageUrls = res.data.imageUrls;
            setImageUrls(imageUrls);
            renderImage(imageUrls, '')
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const changeProductHot = (e) => {
        setHot(e.target.checked);
    };

    useEffect(() => {
        getListCategory();
        getProduct();
    }, []);

    return (<>
        <Header/>
        <Sidebar/>
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>Chỉnh sửa sản phẩm</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                        <li className="breadcrumb-item">Quản lí sản phẩm</li>
                        <li className="breadcrumb-item active">Chỉnh sửa sản phẩm</li>
                    </ol>
                </nav>
            </div>
            <section className="section">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Chỉnh sửa sản phẩm</h5>
                                <Form onFinish={onFinish} id="formUpdate">
                                    <div className="form-group">
                                        <label htmlFor="name">Tên sản phẩm</label>
                                        <input type="text" className="form-control form_input_" id="title"
                                               name="title"
                                               defaultValue={product.title} required/>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-4">
                                            <label htmlFor="price">Giá cũ</label>
                                            <input type="number" min="1" className="form-control form_input_"
                                                   id="price"
                                                   defaultValue={product.price} name="price" required/>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="sale_price">Giá mới</label>
                                            <input type="number" className="form-control form_input_"
                                                   id="sale_price" min="1"
                                                   name="sale_price" defaultValue={product.sale_price}
                                                   required/>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="quantity">Số lượng</label>
                                            <input type="number" min="1" className="form-control form_input_"
                                                   id="quantity"
                                                   name="quantity" defaultValue={product.quantity}
                                                   required/>
                                        </div>
                                    </div>

                                    <div className="form-check">
                                        <input type="checkbox"
                                               className="form-check-input"
                                               name="is_hot"
                                               id="is_hot"
                                               checked={hot}
                                               onChange={changeProductHot}/>
                                        <label className="form-check-label" htmlFor="is_hot">
                                            Sản phẩm nổi bật
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="short_description">Mô tả ngắn</label>
                                        <Editor
                                            apiKey={API_KEY_TINYMCE}
                                            onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                            id="short_description"
                                            name="short_description"
                                            initialValue={product.short_description}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Mô tả</label>
                                        <Editor
                                            apiKey={API_KEY_TINYMCE}
                                            onInit={(evt, editor) => descriptionRef.current = editor}
                                            id="description"
                                            name="description"
                                            initialValue={product.description}
                                        />
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="file">Hình ảnh</label>
                                            <input type="file" className="form-control" id="thumbnail"
                                                   name="thumbnail" onChange={event => handleFileChange(event)}/>

                                            <img className="mt-3" width="100px" src={product.image}
                                                 alt={product.title}/>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="file">Hình ảnh chi tiết</label>
                                            <input type="file" className="form-control" id="gallery"
                                                   name="gallery"
                                                   onChange={event => handleFileChangeMultiple(event)}
                                                   multiple/>
                                            <div id="list_images" className="d-flex align-items-center gap-2"></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-6">
                                            <label htmlFor="categories_id">Danh mục</label>
                                            <select id="categories_id" className="form-control form_input_"
                                                    name="categories_id">
                                                <option value="">Chọn danh mục</option>
                                                {categories.map((category) => (
                                                    <option selected={category.id === product.categories_id}
                                                            value={category.id}>{category.name}</option>))}
                                            </select>
                                        </div>
                                        <div className="form-group col-md-6">
                                            <label htmlFor="is_active">Trạng thái</label>
                                            <select id="is_active" className="form-control form_input_"
                                                    name="is_active">
                                                <option selected={product.is_active} value="1">ĐANG HOẠT ĐỘNG
                                                </option>
                                                <option selected={!product.is_active} value="0">KHÔNG HOẠT ĐỘNG
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" id="btnSave" className="btn btn-primary mt-3">
                                        Lưu thay đổi
                                    </button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>)
}

export default UpdateProduct
