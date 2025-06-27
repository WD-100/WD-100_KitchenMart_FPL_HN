import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Form} from 'antd'
import userService from '../../../Service/UserService';
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';
import uploadService from "../../../Service/UploadService";
import roleService from "../../../Service/RoleService";

function CreateUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [roles, setRoles] = useState([]);

    const getListRole = async () => {
        await roleService.list()
            .then((res) => {
                setRoles(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const onFinish = async () => {
        $('#btnCreate').prop('disabled', true).text('Đang tạo mới...');

        let inputs = $('#formCreate input, #formCreate textarea, #formCreate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val()) {
                let text = $(inputs[i]).prev().text();
                alert(text + ' không được bỏ trống!');
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
                return
            }
        }

        const formData = new FormData($('#formCreate')[0]);

        formData.append('avatar', imageUrl);
        await userService.adminCreateUser(formData)
            .then((res) => {
                console.log("create user", res.data)
                alert("Tạo tài khoản thành công!")
                navigate("/admin/users/list")
            })
            .catch((err) => {
                console.log(err)
                alert(err.response.data.message)
                $('#btnCreate').prop('disabled', false).text('Tạo mới');
            })
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            await uploadImage(selectedFile);
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

    useEffect(() => {
        getListRole();
    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo tài khoản</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Tài khoản</li>
                            <li className="breadcrumb-item active">Tạo tài khoản</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo tài khoản</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="full_name">Tên tài khoản</label>
                                            <input type="text" name="full_name" className="form-control" id="full_name"
                                                   required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" name="email" className="form-control"
                                                       id="email" required/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="phone_number">Số điện thoại</label>
                                                <input type="text" name="phone_number" className="form-control"
                                                       id="phone_number" required/>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="password">Mật khẩu</label>
                                                <input type="password" name="password" className="form-control"
                                                       id="password" required/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="location">Khu vực</label>
                                                <input type="text" name="location" className="form-control"
                                                       id="location"
                                                       required/>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address">Địa chỉ</label>
                                            <input type="text" name="address" className="form-control" id="address"
                                                   required/>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="avatar">Ảnh đại diện</label>
                                                <input type="file" className="form-control" id="avatar"
                                                       onChange={event => handleFileChange(event)}
                                                       required/>
                                                <img src={imageUrl} alt="" id="image" width="100"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="role_id">Quyền hạn</label>
                                                <select id="role_id" name="role_id" className="form-select">
                                                    {roles.map((role) => {
                                                        return (
                                                            <option key={role.id} value={role.id}>
                                                                {role.name}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
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

export default CreateUser
