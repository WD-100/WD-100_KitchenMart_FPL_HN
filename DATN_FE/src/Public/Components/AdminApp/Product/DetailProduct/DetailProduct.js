import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import productService from '../../../Service/ProductService';
import {Descriptions, Card, Image, Typography, Spin} from 'antd';

const {Title} = Typography;

function DetailProduct() {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.adminDetailProduct(id);
                const p = res.data.data.product || {};
                const c = res.data.data.categories || null;
                const photoLibrary = p.photo_library && p.photo_library.length > 0
                    ? p.photo_library.split(',')
                    : [];

                console.log(photoLibrary);

                setProduct({
                    ...p,
                    photo_library: photoLibrary,
                });
                setCategory(c);
            } catch (err) {
                console.log(err)
                console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <Spin className="m-5" size="large" tip="Đang tải..."/>;
    if (!product) return <p className="m-4">Không tìm thấy sản phẩm.</p>;

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chi tiết sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Quản lí sản phẩm</li>
                            <li className="breadcrumb-item active">Chi tiết sản phẩm</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <Card bordered>
                                <Title level={4}>Thông tin sản phẩm</Title>
                                <Descriptions
                                    bordered
                                    column={2}
                                    size="middle"
                                    labelStyle={{width: 180, fontWeight: 500}}
                                >
                                    <Descriptions.Item label="Tên sản phẩm">{product.title}</Descriptions.Item>
                                    <Descriptions.Item
                                        label="Danh mục">{category?.name || 'Không rõ'}</Descriptions.Item>
                                    <Descriptions.Item label="Giá cũ">
                                        {product.price?.toLocaleString()} đ
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Giá mới">
                                        {product.sale_price?.toLocaleString()} đ
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Số lượng">{product.quantity}</Descriptions.Item>
                                    <Descriptions.Item label="Trạng thái">
                                        {product.is_active ? 'ĐANG HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mô tả ngắn" span={2}>
                                        <div dangerouslySetInnerHTML={{__html: product.short_description}}/>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Mô tả chi tiết" span={2}>
                                        <div dangerouslySetInnerHTML={{__html: product.description}}/>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Hình ảnh" span={2}>
                                        <Image width={150} src={product.image} alt={product.title}/>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Thư viện ảnh" span={2}>
                                        <Image.PreviewGroup>
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {product.photo_library.map((img, index) => (
                                                    <Image key={index} width={100} src={img} alt={product.title}/>
                                                ))}
                                            </div>
                                        </Image.PreviewGroup>
                                    </Descriptions.Item>
                                </Descriptions>

                                <div className="mt-4 text-end">
                                    <Link to={`/admin/products/update/${id}`} className="btn btn-primary">
                                        Chỉnh sửa
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default DetailProduct;
