import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, Input, message} from 'antd'
import couponService from '../../../Service/CouponService';
import uploadService from "../../../Service/UploadService";
import {Link, useNavigate} from 'react-router-dom'
import $ from 'jquery';

function CreateCoupon() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');

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

        const start_date = $('#start_date').val();
        const end_date = $('#end_date').val();
        if (start_date > end_date) {
            alert('Ngày bắt đầu không hợp lệ!')
            return false;
        }

        const discount_percent = $('#discount_percent').val();
        if (discount_percent > 100) {
            console.log(discount_percent);
            alert('Phần trăm giảm giá không hợp lệ!')
            return false;
        }

        const formData = new FormData($('#formCreate')[0]);
        formData.append('thumbnail', imageUrl);
        formData.append('value', 1);
        formData.append('used_count', 0);
        await couponService.adminCreateCoupon(formData)
            .then((res) => {
                console.log("create property", res.data)
                message.success("Tạo mã giảm giá thành công!")
                navigate("/admin/coupons/list")
            })
            .catch((err) => {
                console.log(err)
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

    }, [loading]);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Tạo mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Giá trị thuộc tính</li>
                            <li className="breadcrumb-item active">Tạo mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tạo mã giảm giá</h5>
                                    <Form onFinish={onFinish} id="formCreate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên mã giảm giá</label>
                                            <input type="text" name="name" className="form-control" id="name" required/>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="discount_percent">Phần trăm giảm giá</label>
                                                <input type="number" name="discount_percent" className="form-control"
                                                       id="discount_percent" min="0" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="max_discount">Số tiền giảm giá tối đa</label>
                                                <input type="number" name="max_discount" className="form-control"
                                                       id="max_discount" min="0" required/>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="usage_limit">Số lần mã được sử dụng tối đa</label>
                                                <input type="number" name="usage_limit" className="form-control"
                                                       id="usage_limit" min="1" required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="start_date">Ngày bắt đầu</label>
                                                <input type="date" name="start_date" className="form-control"
                                                       id="start_date" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="end_date">Ngày kết thúc</label>
                                                <input type="date" name="end_date" className="form-control"
                                                       id="end_date" required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="min_order_value">Giá trị đơn hàng tối thiểu</label>
                                                <input type="number" name="min_order_value" className="form-control"
                                                       id="min_order_value" min="0" required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="image">Hình ảnh</label>
                                                <input type="file" className="form-control" id="image"
                                                       onChange={event => handleFileChange(event)}
                                                       required/>
                                                <img src={imageUrl} alt="" id="image" width="100"/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="is_active">Trạng thái</label>
                                                <select id="is_active" name="is_active" className="form-select">
                                                    <option value="1">ĐANG HOẠT ĐỘNG</option>
                                                    <option value="0">KHÔNG HOẠT ĐỘNG</option>
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

export default CreateCoupon
