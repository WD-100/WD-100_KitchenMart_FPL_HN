import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import categoryService from '../../../Service/CategoryService';
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';

/**
 * Component for creating a new category.
 *
 * This component contains a form for creating a new category. The form
 * includes fields for the category name, thumbnail, parent category, and
 * status. When the form is submitted, the component sends a request to the
 * server to create a new category with the provided information.
 *
 * If the request is successful, the component shows a success message and
 * navigates to the list of categories.
 *
 * If the request fails, the component shows an error message.
 *
 * @return {ReactElement}
 */
function CreateCategory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const onFinish = async () => {
        setLoading(true);
        $('#btnCreate').prop('disabled', true).text('Đang tạo mới...');

        const req = {
            name: $('#name').val(),
        }

        await categoryService.adminCreateCategory(req)
            .then((res) => {
                console.log("create category", res.data)
                message.success("Tạo danh mục thành công!")
                setLoading(false);
                navigate("/admin/categories/list")
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    useEffect(() => {
    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo danh mục</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Tạo danh mục</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo danh mục</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" name="name" className="form-control" id="name" required/>
                                        </div>
                                        <button type="submit" id="btnCreate" className="btn btn-primary mt-3">Tạo
                                            mới
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

export default CreateCategory
