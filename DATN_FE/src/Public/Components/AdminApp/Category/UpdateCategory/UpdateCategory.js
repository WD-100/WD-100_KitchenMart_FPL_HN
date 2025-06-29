import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import categoryService from '../../../Service/CategoryService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

function UpdateCategory() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const detailCategory = async () => {
        await categoryService.adminDetailCategory(id)
            .then((res) => {
                console.log("detail category", res.data);
                setCategory(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    useEffect(() => {
        detailCategory();
    }, [form, id, loading])


    const onFinish = async () => {
        setLoading(true);
        $('#btnUpdate').prop('disabled', true).text('Đang lưu...');

        const req = {
            name: $('#name').val(),
        }

        await categoryService.adminUpdateCategory(id, req)
            .then((res) => {
                message.success("Thay đổi thành công")
                setLoading(false);
                navigate("/admin/categories/list")
            })
            .catch((err) => {
                console.log(err)
                alert(err.response.data.message)
                setLoading(true);
                $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
            })
    };

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa danh mục</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Chỉnh sửa danh mục</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa danh mục</h5>
                                    <Form onFinish={onFinish} id="formUpdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   defaultValue={category.name} required/>
                                        </div>
                                        <button type="submit" id="btnUpdate" className="btn btn-primary mt-3">Lưu lại
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

export default UpdateCategory
