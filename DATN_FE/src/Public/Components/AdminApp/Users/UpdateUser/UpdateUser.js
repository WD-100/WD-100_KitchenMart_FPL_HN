import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';
import userService from "../../../Service/UserService";
import uploadService from "../../../Service/UploadService";
import roleService from "../../../Service/RoleService";

function UpdateUser() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
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
        $('#btnUpdate').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdate input, #formUpdate textarea, #formUpdate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file' && $(inputs[i]).attr('type') !== 'password') {
                let text = $(inputs[i]).prev().text();
                message.error(text + ' không được bỏ trống!');
                $('#btnUpdate').prop('disabled', false).text('Lưu lại');
                return
            }
        }

        const formData = new FormData($('#formUpdate')[0]);
        formData.append('avatar', imageUrl);
        await userService.adminUpdateUser(id, formData)
            .then((res) => {
                console.log("create user", res.data)
                message.success("Lưu tài khoản thành công!")
                navigate("/admin/users/list")
            })
            .catch((err) => {
                console.log(err)
                message.error(err.response.data.message)
                $('#btnUpdate').prop('disabled', false).text('Lưu lại');
            })
    };

    const detailUser = async () => {
        await userService.adminDetailUser(id)
            .then((res) => {
                setUser(res.data.data);
                setLoading(false);
                setImageUrl(res.data.data.avatar);
            })
            .catch((err) => {
                console.log(err)
                setLoading(false);
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
        detailUser();
    }, [])

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa tài khoản</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Tài khoản</li>
                            <li className="breadcrumb-item active">Chỉnh sửa tài khoản</li>
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
                                            <label htmlFor="full_name">Tên tài khoản</label>
                                            <input type="text" name="full_name" className="form-control" id="full_name"
                                                   defaultValue={user.full_name}
                                                   required/>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="email">Email</label>
                                                <input type="email" name="email" className="form-control"
                                                       defaultValue={user.email}
                                                       id="email" required/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="phone_number">Số điện thoại</label>
                                                <input type="text" name="phone_number" className="form-control"
                                                       defaultValue={user.phone_number}
                                                       id="phone_number" required/>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="password">Mật khẩu</label>
                                                <input type="password" name="password" className="form-control"
                                                       id="password"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="location">Khu vực</label>
                                                <input type="text" name="location" className="form-control"
                                                       id="location"
                                                       defaultValue={user.location}
                                                       required/>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="address">Địa chỉ</label>
                                            <input type="text" name="address" className="form-control" id="address"
                                                   defaultValue={user.address}
                                                   required/>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="avatar">Ảnh đại diện</label>
                                                <input type="file" className="form-control" id="avatar"
                                                       onChange={event => handleFileChange(event)}/>
                                                <img src={imageUrl} alt="" id="image" width="100"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="role_id">Quyền hạn</label>
                                                <select id="role_id" name="role_id" className="form-select">
                                                    {roles.map((role) => {
                                                        return (
                                                            <option selected={user?.role_id === role.id} key={role.id}
                                                                    value={role.id}>
                                                                {role.name}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
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

export default UpdateUser
