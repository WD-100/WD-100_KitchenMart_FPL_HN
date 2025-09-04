import React, {useEffect, useRef, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Link, useNavigate} from 'react-router-dom'
import productService from '../../../Service/ProductService';
import categoryService from '../../../Service/CategoryService';
import uploadService from '../../../Service/UploadService';
import $ from 'jquery';
import {Editor} from '@tinymce/tinymce-react';
import {API_KEY_TINYMCE} from '../../../config/Constants';
import {Form, message} from 'antd';

function CreateProduct() {
    const navigate = useNavigate();
    const [categories, setData] = useState([]);
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [loading, setLoading] = useState(true);
    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);

    let isFeature = false;
    let isHot = false;

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

    const onFinish = async () => {
        setLoading(true)
        $('#btnCreate').prop('disabled', true).text('Đang tạo mới...');

        let inputs = $('#formCreate input.form_input_, #formCreate textarea.form_input_, #formCreate select.form_input_');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val()) {
                let text = $(inputs[i]).prev().text();
                message.error(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
                setLoading(false);
                return;
            }
        }

        const formData = new FormData($('#formCreate')[0]);

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

        if ($('#isFeature').is(":checked")) {
            isFeature = true;
        }

        if ($('#isHot').is(":checked")) {
            isHot = true;
        }

        formData.append('is_feature', isFeature);
        formData.append('is_hot', isHot);

        await productService.adminCreateProduct(formData)
            .then((res) => {
                setLoading(false)
                message.success("Tạo mới sản phẩm thành công")
                navigate("/admin/products/list")
            })
            .catch((err) => {
                setLoading(false)
                message.error(err.message);
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

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

    function renderImage(images, alt) {
        let html = '';
        for (let i = 0; i < images.length; i++) {
            html += `<div class="item">
          <img width="100px" src="${images[i]}" alt="${alt}">
        </div>`;
        }

        $('#list_images').empty().append(html);
    }

    useEffect(() => {
        getListCategory();
    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo mới sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Tạo mới sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo mới sản phẩm</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="title">Tên sản phẩm</label>
                                            <input type="text" className="form-control form_input_" id="title"
                                                   name="title" required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="price">Giá cũ</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="price" name="price" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="sale_price">Giá mới</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="sale_price" name="sale_price" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="quantity">Số lượng</label>
                                                <input type="number" min="1" className="form-control form_input_"
                                                       id="quantity" name="quantity" required/>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="price">Sản phẩm nổi bật</label>
                                                <input type="checkbox" className="form-control"
                                                       id="is_hot" name="is_hot"/>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="short_description">Mô tả ngắn</label>
                                            {/*<textarea className="form-control form_input_" name="short_description"*/}
                                            {/*          id="short_description"*/}
                                            {/*          rows="10"></textarea>*/}
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                                init={{
                                                    plugins: [
                                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                                    ],
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    tinycomments_mode: 'embedded',
                                                    tinycomments_author: 'Author name',
                                                    /**
                                                     * The AI request function. This function is called when the AI button in the toolbar is clicked.
                                                     * It should return a promise that resolves with a string containing the AI response.
                                                     * The string should be a valid HTML string.
                                                     * The function takes two parameters, `request` and `respondWith`. `request` is an object containing information about the request,
                                                     * and `respondWith` is a function that should be called with the response string.
                                                     * The `respondWith` function takes one parameter, a string containing the response.
                                                     * The `respondWith` function should be called with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The function should return a promise.
                                                     * The promise should resolve with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The AI request function should be a function.
                                                     * @param {object} request - The request object.
                                                     * @param {function} respondWith - The respondWith function.
                                                     * @returns {Promise<string>} - A promise that resolves with a string containing the AI response.
                                                     */
                                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                                }}
                                                id="short_description"
                                                name="short_description"
                                                initialValue=""
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="description">Mô tả</label>
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => descriptionRef.current = editor}
                                                init={{
                                                    plugins: [
                                                        'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                                        'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                                                    ],
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    tinycomments_mode: 'embedded',
                                                    tinycomments_author: 'Author name',
                                                    /**
                                                     * The AI request function. This function is called when the AI button in the toolbar is clicked.
                                                     * It should return a promise that resolves with a string containing the AI response.
                                                     * The string should be a valid HTML string.
                                                     * The function takes two parameters, `request` and `respondWith`. `request` is an object containing information about the request,
                                                     * and `respondWith` is a function that should be called with the response string.
                                                     * The `respondWith` function takes one parameter, a string containing the response.
                                                     * The `respondWith` function should be called with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The function should return a promise.
                                                     * The promise should resolve with a string containing the AI response.
                                                     * The AI response should be a valid HTML string.
                                                     * The AI request function should be a function.
                                                     * @param {object} request - The request object.
                                                     * @param {function} respondWith - The respondWith function.
                                                     * @returns {Promise<string>} - A promise that resolves with a string containing the AI response.
                                                     */
                                                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                                }}
                                                id="description"
                                                name="description"
                                                initialValue=""
                                            />
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh</label>
                                                <input type="file" className="form-control" id="thumbnail"
                                                       name="thumbnail" onChange={event => handleFileChange(event)}
                                                       required/>
                                                <img src={imageUrl} alt="" id="imageProduct" width="100"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="file">Hình ảnh chi tiết</label>
                                                <input type="file" className="form-control" id="gallery"
                                                       name="gallery"
                                                       onChange={event => handleFileChangeMultiple(event)}
                                                       multiple required/>
                                                <div id="list_images" className="d-flex align-items-center gap-2">

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="categories_id">Danh mục</label>
                                                <select id="categories_id" className="form-control form_input_"
                                                        name="categories_id">
                                                    <option value="">Chọn danh mục</option>
                                                    {
                                                        categories.map((category) => (
                                                            <option value={category.id}>{category.name}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="is_active">Trạng thái</label>
                                                <select id="is_active" name="is_active" className="form-select">
                                                    <option value="1">ĐANG HOẠT ĐỘNG</option>
                                                    <option value="0">KHÔNG HOẠT ĐỘNG</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button type="submit" id="btnCreate" className="btn btn-primary mt-3"
                                                disabled={loading}>
                                            Tạo mới
                                        </button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default CreateProduct
