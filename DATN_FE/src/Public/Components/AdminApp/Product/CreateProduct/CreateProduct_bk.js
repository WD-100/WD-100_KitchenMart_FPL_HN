import React, {useEffect, useRef, useState} from 'react';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import {Link, useNavigate} from 'react-router-dom';
import productService from '../../../Service/ProductService';
import categoryService from '../../../Service/CategoryService';
import uploadService from '../../../Service/UploadService';
import {Editor} from '@tinymce/tinymce-react';
import {API_KEY_TINYMCE} from '../../../config/Constants';
import {Button, Checkbox, Form, Input, InputNumber, message, Select} from 'antd';

function CreateProduct() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const shortDescriptionRef = useRef(null);
    const descriptionRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.adminListCategory();
                setCategories(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

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
        const shortDescriptionContent = shortDescriptionRef.current.getContent();
        const descriptionContent = descriptionRef.current.getContent();

        if (!shortDescriptionContent || !descriptionContent) {
            message.error('Vui lòng nhập đầy đủ mô tả ngắn và mô tả chi tiết.');
            return;
        }

        const formData = new FormData();
        for (const [key, val] of Object.entries(values)) {
            formData.append(key, val);
        }
        formData.append('short_description', shortDescriptionContent);
        formData.append('description', descriptionContent);
        formData.append('image', imageUrl);
        formData.append('photo_library', JSON.stringify(imageUrls));

        try {
            btnRef.current.disabled = true;
            btnRef.current.innerText = 'Đang tạo mới...';
            await productService.adminCreateProduct(formData);
            message.success('Tạo mới sản phẩm thành công');
            navigate('/admin/products/list');
        } catch (err) {
            message.error(err.message || 'Tạo mới thất bại');
        } finally {
            btnRef.current.disabled = false;
            btnRef.current.innerText = 'Tạo mới';
        }
    };

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
                                    <Form form={form} layout="vertical" onFinish={onFinish}>
                                        <Form.Item name="title" label="Tên sản phẩm" rules={[{required: true}]}>
                                            <Input/></Form.Item>
                                        <Form.Item name="price" label="Giá cũ" rules={[{required: true}]}> <InputNumber
                                            min={1} style={{width: '100%'}}/></Form.Item>
                                        <Form.Item name="sale_price" label="Giá mới" rules={[{required: true}]}>
                                            <InputNumber min={1} style={{width: '100%'}}/></Form.Item>
                                        <Form.Item name="quantity" label="Số lượng" rules={[{required: true}]}>
                                            <InputNumber min={1} style={{width: '100%'}}/></Form.Item>
                                        <Form.Item name="is_feature" valuePropName="checked"> <Checkbox>Sản phẩm nổi
                                            bật</Checkbox> </Form.Item>
                                        <Form.Item name="is_hot" valuePropName="checked"> <Checkbox>Sản phẩm
                                            hot</Checkbox> </Form.Item>

                                        <Form.Item label="Mô tả ngắn">
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => shortDescriptionRef.current = editor}
                                                init={{toolbar: 'undo redo | bold italic', height: 200}}
                                            />
                                        </Form.Item>

                                        <Form.Item label="Mô tả chi tiết">
                                            <Editor
                                                apiKey={API_KEY_TINYMCE}
                                                onInit={(evt, editor) => descriptionRef.current = editor}
                                                init={{toolbar: 'undo redo | bold italic', height: 300}}
                                            />
                                        </Form.Item>

                                        <Form.Item label="Hình ảnh">
                                            <input type="file" onChange={handleFileChange}/>
                                            {imageUrl && <img src={imageUrl} alt="" width="100"/>}
                                        </Form.Item>

                                        <Form.Item label="Hình ảnh chi tiết">
                                            <input type="file" multiple onChange={handleFileChangeMultiple}/>
                                            <div className="d-flex align-items-center gap-2">
                                                {imageUrls.map((url, idx) => <img key={idx} src={url} alt=''
                                                                                  width='100'/>)}
                                            </div>
                                        </Form.Item>

                                        <Form.Item name="categories_id" label="Danh mục" rules={[{required: true}]}>
                                            <Select placeholder="Chọn danh mục">{categories.map(c => <Select.Option
                                                key={c.id} value={c.id}>{c.name}</Select.Option>)}</Select> </Form.Item>
                                        <Form.Item name="is_active" label="Trạng thái" rules={[{required: true}]}>
                                            <Select><Select.Option value="1">Đang hoạt
                                                động</Select.Option><Select.Option value="0">Không hoạt
                                                động</Select.Option></Select> </Form.Item>

                                        <Button type="primary" htmlType="submit" ref={btnRef} disabled={loading}>Tạo
                                            mới</Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default CreateProduct;