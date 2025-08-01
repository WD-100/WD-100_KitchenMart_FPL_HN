import React, {useEffect, useState} from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import {Button, Form, Input, message, Radio, Spin} from 'antd';
import {Link, useSearchParams} from 'react-router-dom';
import reviewService from '../../../Service/ReviewService';
import productService from '../../../Service/ProductService';
import LoadingPage from "../../../Shared/Utils/LoadingPage";

function ReviewProduct() {
    const [searchParams] = useSearchParams();
    const [product, setProduct] = useState({});
    const [review, setReview] = useState({});
    const [isReview, setIsReview] = useState(false);
    const [order, setOrder] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
                                                {[' (Rất Tệ)', ' (Tệ)', ' (Bình thường)', ' (Tốt)', ' (Rất Tốt)'][star - 1]}
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
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    Gửi đánh giá
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="verified_customer_section mb-2">
                                <div className="image_review">
                                    <div className="customer_name_review_status">
                                        <div className="customer_name">Sản phẩm:
                                            <h4><a href={`/products/${product.slug}`}>{product.title}</a></h4>
                                        </div>
                                        <div className="customer_review">
                                            Số sao: {Array.from({length: 5}).map((_, i) => (
                                            <i key={i}
                                               className={`fa-solid fa-star ${i < review.stars ? 'filled' : ''}`}/>
                                        ))}
                                        </div>
                                    </div>
                                </div>
                                <h5>Tiêu đề: <b>{review.title}</b></h5>
                                <div className="customer_comment text_truncate_3_">
                                    Nội dung: {review.content}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default ReviewProduct;