import React from 'react';
import {Form, Input, Button, message} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import attributeService from '../../../Service/AttributeService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';

function CreateAttribute() {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await attributeService.adminCreateAttribute(values);
            console.log('create attribute', res.data);
            message.success('Tạo thành công!');
            form.resetFields();
        } catch (err) {
            console.error(err);
            message.error(err.message ?? 'Thất bại');
        }
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo Biến Thể</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin/dashboard">Trang quản trị</Link>
                            </li>
                            <li className="breadcrumb-item">Biến Thể</li>
                            <li className="breadcrumb-item active">Tạo Biến Thể</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo Biến Thể</h5>

                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        initialValues={{name: ''}}
                                    >
                                        <Form.Item
                                            label="Tên biến thể"
                                            name="name"
                                            rules={[{required: true, message: 'Vui lòng nhập tên biến thể!'}]}
                                        >
                                            <Input placeholder="Nhập tên biến thể"/>
                                        </Form.Item>

                                        <Button type="primary" htmlType="submit">
                                            Tạo mới
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

export default CreateAttribute;
