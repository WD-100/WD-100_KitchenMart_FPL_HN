import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import categoryService from '../../../Service/CategoryService';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

function DetailCategory() {
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

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
    }, [loading])

    return (<>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chi tiết danh mục</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Danh mục</li>
                            <li className="breadcrumb-item active">Chi tiết danh mục</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chi tiết danh mục</h5>
                                    <Form>
                                        <div className="form-group">
                                            <label htmlFor="name">Tên danh mục</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   value={category.name} disabled required/>
                                        </div>
                                        <a href={'/admin/categories/update/' + id} className="btn btn-primary mt-3">Chỉnh
                                            sửa
                                        </a>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>)
}

export default DetailCategory
