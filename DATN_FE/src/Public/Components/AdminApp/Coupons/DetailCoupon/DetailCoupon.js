import {Form, message} from 'antd';
import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import couponService from '../../../Service/CouponService';
import uploadService from "../../../Service/UploadService";
import Header from '../../../Shared/Admin/Header/Header';
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar';
import $ from 'jquery';

function DetailCoupon() {
    const [coupon, setCoupon] = useState([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const detailCoupon = async () => {
        await couponService.adminDetailCoupon(id)
            .then((res) => {
                console.log("detail coupon", res.data);
                setCoupon(res.data)
                setImageUrl(res.data.thumbnail)
                setLoading(false)

                if (res.data?.start_date) {
                    setStartDate(new Date(res.data.start_date).toISOString().slice(0, 10));
                }
                if (res.data?.end_date) {
                    setEndDate(new Date(res.data.end_date).toISOString().slice(0, 10));
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    };

    const onFinish = async () => {
        $('#btnUpdate').prop('disabled', true).text('Đang lưu...');

        let inputs = $('#formUpdate input, #formUpdate textarea, #formUpdate select');
        for (let i = 0; i < inputs.length; i++) {
            if (!$(inputs[i]).val() && $(inputs[i]).attr('type') !== 'file') {
                let text = $(inputs[i]).prev().text();
                message.error(text + ' không được bỏ trống!');
                $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
                return
            }
        }
        const date1 = new Date($("#start_date").val());
        const date2 = new Date($("#end_date").val());

        if (date1.getTime() > date2.getTime()) {
            $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
            message.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc!');
            return false;

        }
        const formData = new FormData($('#formUpdate')[0]);
        formData.append('thumbnail', imageUrl);
        formData.append('value',1);
        await couponService.adminUpdateCoupon(id, formData)
            .then((res) => {
                message.success("Thay đổi thành công")
                navigate("/admin/coupons/list")
            })
            .catch((err) => {
                console.log(err)
                message.error(err.response.data.message)
                $('#btnUpdate').prop('disabled', false).text('Lưu thay đổi');
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
        detailCoupon();
    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Mã giảm giá</li>
                            <li className="breadcrumb-item active">Chỉnh sửa mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa mã giảm giá</h5>
                                    <Form onFinish={onFinish} id="formUpdate">
                                        <div className="form-group">
                                            <label htmlFor="name">Tên mã giảm giá</label>
                                            <input type="text" name="name" className="form-control" id="name"
                                                   defaultValue={coupon.name} required/>
                                        </div>

                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="discount_percent">Phần trăm giảm giá</label>
                                                <input type="number" name="discount_percent" className="form-control"
                                                       id="discount_percent" min="0"
                                                       defaultValue={coupon.discount_percent} required/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="max_discount">Số tiền giảm giá tối đa</label>
                                                <input type="number" name="max_discount" className="form-control"
                                                       id="max_discount" min="0" defaultValue={coupon.max_discount}
                                                       required/>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="start_date">Ngày bắt đầu</label>
                                                <input type="date" name="start_date" className="form-control"
                                                       id="start_date"
                                                       value={startDate}
                                                       onChange={(e) => setStartDate(e.target.value)}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="end_date">Ngày kết thúc</label>
                                                <input type="date" name="end_date" className="form-control"
                                                       id="end_date"
                                                       value={endDate}
                                                       onChange={(e) => setEndDate(e.target.value)}
                                                       required/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="min_order_value">Giá trị đơn hàng tối thiểu</label>
                                                <input type="number" name="min_order_value" className="form-control"
                                                       id="min_order_value" min="0"
                                                       defaultValue={coupon.min_order_value} required/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-4">
                                                <label htmlFor="image">Hình ảnh</label>
                                                <input type="file" className="form-control" id="image"
                                                       onChange={event => handleFileChange(event)}/>
                                                <img src={imageUrl} alt="" id="image" width="100"/>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="type">Loại mã giảm giá</label>
                                                <select id="type" name="type" className="form-select">
                                                    <option selected={coupon.type === "percent"} value="percent">Theo
                                                        phần trăm
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="is_active">Trạng thái</label>
                                                <select id="is_active" name="is_active" className="form-select">
                                                    <option selected={coupon.is_active} value="1">ĐANG HOẠT ĐỘNG
                                                    </option>
                                                    <option selected={!coupon.is_active} value="0">KHÔNG HOẠT ĐỘNG
                                                    </option>
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

export default DetailCoupon