import React, {useEffect, useState} from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import {Button, Form, Input, message, Radio, Spin, Upload} from 'antd';
import {Link, useSearchParams} from 'react-router-dom';
import reviewService from '../../../Service/ReviewService';
import productService from '../../../Service/ProductService';
import LoadingPage from "../../../Shared/Utils/LoadingPage";
import uploadService from "../../../Service/UploadService";

function ReviewProduct() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState({});
    const [review, setReview] = useState({});
    const [isReview, setIsReview] = useState(false);
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const [form] = Form.useForm();

    const pro = searchParams.get('pro') ?? '';
    const or = searchParams.get('order') ?? '';

    const fetchData = async () => {
        try {
            const reviewRes = await reviewService.checkReviewByProduct(pro, or);
            if (reviewRes.status === 200 && reviewRes.data.data.valid) {
                const data = reviewRes.data.data;
                setIsReview(true);
                setOrder(data.order);
                setReview(data.review);
                setProduct(data.product);
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi khi tải dữ liệu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pro, or]);

    const onFinish = async (values) => {
        setSubmitting(true);
        LoadingPage();

        const payload = {
            ...values,
            order_id: or,
            thumbnail: imageUrl,
            product_id: pro
        };

        try {
            const res = await reviewService.sendReview(payload);
            if (res.status === 200) {
                message.success("Đánh giá sản phẩm thành công!");
                window.history.back();
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi. Vui lòng thử lại sau");
        } finally {
            setSubmitting(false);
            LoadingPage();
        }
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        for (let file of files) {
            await uploadImage(file);
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

    if (loading) {
        return <Spin fullscreen/>;
    }

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Đánh giá sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                            <li className="breadcrumb-item active">Đánh giá sản phẩm</li>
                        </ol>
                    </nav>
                </div>
                <div className="p-2 bg-white">
                    {!isReview ? (
                        <div className="row">
                            <h5 className="text-start text-success mt-3">Đánh giá của bạn...</h5>
                            <Form
                                id="formReviewProduct"
                                form={form}
                                onFinish={onFinish}
                                layout="vertical"
                            >
                                <Form.Item
                                    name="stars"
                                    label="Chất lượng"
                                    rules={[{required: true, message: 'Vui lòng chọn đánh giá sao'}]}
                                >
                                    <Radio.Group>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Radio key={star} value={star}>
                                                {[...Array(5)].map((_, i) => (
                                                    <i
                                                        key={i}
                                                        className={`fa-solid fa-star ${i < star ? '' : 'none_active'}`}
                                                    ></i>
                                                ))}
                                                {[' (Rất Tệ)', ' (Tệ)', ' (Bình thường)', ' (Tốt)', ' (Rất Tốt)'][star]}
                                            </Radio>
                                        ))}
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[{required: true, message: 'Vui lòng nhập tiêu đề'}]}
                                >
                                    <Input/>
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    label="Nội dung"
                                    rules={[{required: true, message: 'Vui lòng nhập nội dung'}]}
                                >
                                    <Input.TextArea rows={5}/>
                                </Form.Item>
                                <Form.Item label="Hình ảnh">
                                    <input type="file" accept="image/*" onChange={handleFileChange}/>
                                    <div style={{display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap'}}>
                                        <img src={imageUrl}
                                             style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 8}}
                                        />
                                    </div>
                                </Form.Item>
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    Gửi đánh giá
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <td><b>Sản phẩm</b></td>
                                <td>
                                    <a href={`/products/${product.slug}`}>{product.title}</a>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Số sao</b></td>
                                <td>
                                   {Array.from({ length: 5 }).map((_, i) => (
                                        <i
                                            key={i}
                                            className={`${i < review.stars ? 'fa-solid' : 'fa-regular'} fa-star`}
                                            style={{ color: i < review.stars ? 'gold' : '#ccc' }}
                                        />
                                    ))}
                                </td>
                            </tr>
                            <tr>
                                <td><b>Tiêu đề</b></td>
                                <td>{review.title}</td>
                            </tr>
                            <tr>
                                <td><b>Nội dung</b></td>
                                <td className="text_truncate_3_">{review.content}</td>
                            </tr>
                            <tr>
                                <td><b>Ảnh đính kèm</b></td>
                                <td>
                                    <img src={review.thumbnail}
                                         style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 8}}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </>
    );
}

export default ReviewProduct;