import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import attributeService from '../../../Service/AttributeService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';

function DetailAttribute() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const detailAttribute = async () => {
        try {
            setLoading(true);
            const res = await attributeService.adminDetailAttribute(id);
            console.log('details attribute', res.data);
            form.setFieldsValue({ name: res.data.name }); // set value into AntD form
        } catch (err) {
            console.error(err);
            message.error('Không thể tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detailAttribute();
    }, [id]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const res = await attributeService.adminUpdateAttribute(id, values);
            console.log('update attribute', res.data);
            message.success('Thay đổi thành công');
            navigate('/admin/attributes/list');
        } catch (err) {
            console.error(err);
            message.error(err.message ?? 'Thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa Biến Thể</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin/dashboard">Trang quản trị</Link>
                            </li>
                            <li className="breadcrumb-item">Biến Thể</li>
                            <li className="breadcrumb-item active">Chỉnh sửa Biến Thể</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa Biến Thể</h5>

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        initialValues={{ name: '' }}
                                    >
                                        <Form.Item
                                            label="Tên Biến Thể"
                                            name="name"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên Biến Thể!' }]}
                                        >
                                            <Input placeholder="Nhập tên Biến Thể" />
                                        </Form.Item>

                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            loading={loading}
                                            className="mt-2"
                                        >
                                            Lưu lại
                                        </Button>
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

export default DetailAttribute;
