import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Button, Form, message, Table} from 'antd';
import couponService from '../../../Service/CouponService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';

function ListCoupon() {
    const handleDelete = async (id) => {
        setLoading(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await couponService.adminDeleteCoupon(id)
                .then((res) => {
                    message.success(`Xóa thành công!`)
                    getListDiscount();
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    message.error(err.response.data.message)
                    setLoading(false);
                })
        }
    }

    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchProperty").on("input", function () {
                var value = $(this).val().toLowerCase();
                $(".ant-table-content table tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '5%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên mã giảm giá',
            dataIndex: 'name',
            width: 'x',
        },
        {
            title: 'Mã số',
            dataIndex: 'code',
            width: '10%',
        },
        {
            title: 'Loại mã giảm giá',
            dataIndex: 'type',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <span className="badge bg-warning">
                        {record.type === 'percent' ? 'Theo phần trăm' : 'Số tiền cố định'}
                    </span>
                );
            }
        },
        {
            title: 'Phần trăm giảm giá',
            dataIndex: 'discount_percent',
            width: '10%',
        },
        {
            title: 'Giá trị giảm giá',
            dataIndex: 'value',
            width: '10%',
        },
        {
            title: 'Giảm tối đa',
            dataIndex: 'max_discount',
            width: '10%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_active',
            width: '10%',
            render: (text, record, index) => {
                return (
                    <span className={`badge ${record.is_active ? 'bg-success' : 'bg-danger'}`}>
                        {record.is_active ? 'ĐANG HOẠT ĐỘNG' : 'KHÔNG HOẠT ĐỘNG'}
                    </span>
                );
            }
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'x',
            width: '15%',
            render: (id) =>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Link to={`/admin/coupons/detail/${id}`} className="btn btn-sm btn-primary">
                        Xem chi tiết
                    </Link>

                    <button type="button" id={`btnDelete_${id}`} className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(id)}>Xóa
                    </button>
                </div>
        },
    ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const getListDiscount = async () => {
        await couponService.adminListCoupon()
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    useEffect(() => {
        getListDiscount();
        loadFn();

    }, []);
    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    return (
        <>
            <Header/>
            <Sidebar/>

            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Danh sách mã giảm giá</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Mã giảm giá</li>
                            <li className="breadcrumb-item active">Danh sách mã giảm giá</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm mã giảm giá</h5>
                        <input className="form-control" id="inputSearchProperty" type="text"
                               placeholder="Nhập từ khóa..."/>
                        <br/>
                    </div>

                    <Table
                        style={{margin: "auto"}}
                        columns={columns}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                        locale={{emptyText: "No data available"}}
                    />

                </div>
            </main>
        </>
    )
}

export default ListCoupon
