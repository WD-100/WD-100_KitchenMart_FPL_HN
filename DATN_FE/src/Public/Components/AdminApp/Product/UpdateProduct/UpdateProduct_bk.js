import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import {Link, useNavigate, useParams} from 'react-router-dom';
import productService from '../../../Service/ProductService';
import categoryService from '../../../Service/CategoryService';
import uploadService from '../../../Service/UploadService';
import {Editor} from '@tinymce/tinymce-react';
import {API_KEY_TINYMCE} from '../../../config/Constants';
import {Button, Checkbox, Form, Input, InputNumber, message, Select, Spin} from 'antd';

function UpdateProduct() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [form] = Form.useForm();

    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.adminListCategory();
                setCategories(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchProduct = async () => {
            try {
                const res = await productService.adminDetailProduct(id);
                const data = res.data.data.product;
                setProduct(data); // tạm thời lưu, không setFieldsValue ở đây
            } catch (err) {
                message.error('Không thể lấy thông tin sản phẩm.');
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                title: product.title,
                price: product.price,
                sale_price: product.sale_price,
                quantity: product.quantity,
                is_hot: product.is_hot === 1,
                categories_id: product.categories_id,
                is_active: product.is_active.toString(),
            });

            shortDescriptionRef.current?.setContent(product.short_description || '');
            descriptionRef.current?.setContent(product.description || '');

            try {
                const photoLibrary = product.photo_library
                    ? JSON.parse(product.photo_library)
                    : [];

                setImageUrl(product.image);
                setImageUrls(Array.isArray(photoLibrary) ? photoLibrary : []);
            } catch {
                setImageUrls([]);
            }
        }
    }, [product]);


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await uploadService.upload(formData);
            setImageUrl(res.data.imageUrl);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChangeMultiple = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        setLoading(true);
        try {
            const formData = new FormData();
            files.forEach((file) => formData.append('image', file));
            const res = await uploadService.multiple(formData);
            setImageUrls(res.data.imageUrls);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values) => {
        const shortDescriptionContent = shortDescriptionRef.current?.getContent();
        const descriptionContent = descriptionRef.current?.getContent();

        if (!shortDescriptionContent || !descriptionContent) {
            message.error('Vui lòng nhập đầy đủ mô tả ngắn và mô tả chi tiết.');
            return;
        }

        const payload = {
            ...values,
            short_description: shortDescriptionContent,
            description: descriptionContent,
            image: imageUrl,
            photo_library: imageUrls,
        };

        setLoading(true);
        try {
            await productService.adminUpdateProduct(id, payload);
            message.success('Cập nhật sản phẩm thành công');
            navigate('/admin/products/list');
        } catch (err) {
            message.error(err.message || 'Cập nhật thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Cập nhật sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Cập nhật sản phẩm</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Cập nhật sản phẩm</h5>
                                    <Spin spinning={loading}>
                                        <Form
                                            form={form}
                                            layout="vertical"
                                            onFinish={onFinish}
                                            autoComplete="off"
                                        >
                                            <Form.Item name="title" label="Tên sản phẩm" rules={[{required: true}]}>
                                                <Input/> </Form.Item>
                                            <Form.Item name="price" label="Giá cũ" rules={[{required: true}]}>
                                                <InputNumber min={1} style={{width: '100%'}}/> </Form.Item>
                                            <Form.Item name="sale_price" label="Giá mới" rules={[{required: true}]}>
                                                <InputNumber min={1} style={{width: '100%'}}/> </Form.Item>
                                            <Form.Item name="quantity" label="Số lượng" rules={[{required: true}]}>
                                                <InputNumber min={1} style={{width: '100%'}}/> </Form.Item>
                                            <Form.Item name="is_hot" valuePropName="checked"> <Checkbox>Sản phẩm
                                                hot</Checkbox> </Form.Item>

                                            <Form.Item label="Mô tả ngắn">
                                                <Editor apiKey={API_KEY_TINYMCE}
                                                        onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                                        init={{toolbar: 'undo redo | bold italic', height: 200}}/>
                                            </Form.Item>

                                            <Form.Item label="Mô tả chi tiết">
                                                <Editor apiKey={API_KEY_TINYMCE}
                                                        onInit={(evt, editor) => descriptionRef.current = editor}
                                                        init={{toolbar: 'undo redo | bold italic', height: 300}}/>
                                            </Form.Item>

                                            <Form.Item label="Hình ảnh">
                                                <input type="file" onChange={handleFileChange}/>
                                                {imageUrl && <img src={imageUrl} alt="" width="100" className="mt-2"/>}
                                            </Form.Item>

                                            <Form.Item label="Hình ảnh chi tiết">
                                                <input type="file" multiple onChange={handleFileChangeMultiple}/>
                                                <div className="d-flex align-items-center gap-2 mt-2">
                                                    {imageUrls.map((url, idx) => (
                                                        <img key={idx} src={url} alt="" width="100"/>
                                                    ))}
                                                </div>
                                            </Form.Item>

                                            <Form.Item name="categories_id" label="Danh mục" rules={[{required: true}]}>
                                                <Select placeholder="Chọn danh mục"> {categories.map(c => (
                                                    <Select.Option key={c.id}
                                                                   value={c.id}>{c.name}</Select.Option>))} </Select>
                                            </Form.Item>

                                            <Form.Item name="is_active" label="Trạng thái" rules={[{required: true}]}>
                                                <Select> <Select.Option value="1">Đang hoạt động</Select.Option>
                                                    <Select.Option value="0">Không hoạt động</Select.Option> </Select>
                                            </Form.Item>

                                            <Button type="primary" htmlType="submit" loading={loading}> Cập
                                                nhật </Button>
                                        </Form>
                                    </Spin>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default UpdateProduct;
