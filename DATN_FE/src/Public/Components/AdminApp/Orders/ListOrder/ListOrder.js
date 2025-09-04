import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {message, Table} from 'antd';
import orderService from '../../../Service/OrderService';
import {Link} from 'react-router-dom';
import $ from "jquery";
import ConvertCurrency from "../../../Shared/Utils/ConvertCurrency";

function ListOrder() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchOrder").on("keyup", function () {
                var value = $(this).val().toLowerCase();
                $(".ant-table-content table tr").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });
    }

    const statusMap = {
        PENDING: 'CHỜ XÁC NHẬN',
        PROCESSING: 'ĐANG XỬ LÝ',
        CONFIRMED: 'ĐÃ XÁC NHẬN',
        SHIPPING: 'ĐANG VẬN CHUYỂN',
        CANCELED: 'ĐÃ HỦY',
        DELIVERED: 'ĐÃ GIAO HÀNG',
        COMPLETED: 'ĐÃ HOÀN THÀNH',
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên đầy đủ',
            dataIndex: 'full_name',
            width: '15%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            width: '12%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '12%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: '20%',
        },
        {
            title: 'Tổng tiền ',
            dataIndex: 'total_price',
            width: '10%',
            render: (text) => {
                return ConvertCurrency(text)
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: '10%',
            render: (text) => {
                return statusMap[text] || 'KHÔNG XÁC ĐỊNH';
            },
        },
        {
            title: 'Hành động',
            dataIndex: '_id',
            key: 'x',
            render: (text, record, index) => {
                const {_id} = data[index];
                return (
                    <>
                        <Link to={`/admin/orders/detail/${_id}`} className="btn btn-primary">
                            Xem chi tiết
                        </Link>
                    </>
                );
            },
        },
    ];

    const getListOrder = async () => {
        await orderService.adminListOrder('')
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    setData(res.data.data)
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }

    const selectStatus = async () => {
        let status = $('#inputState').val();
        status = parseInt(status.trim());
        let statusName;
        switch (status) {
            case 1:
                statusName = 'PENDING';
                break;
            case 2:
                statusName = 'PROCESSING';
                break;
            case 3:
                statusName = 'CONFIRMED';
                break;
            case 4:
                statusName = 'SHIPPING';
                break;
            case 5:
                statusName = 'CANCELED';
                break;
            case 6:
                statusName = 'DELIVERED';
                break;
            case 7:
                statusName = 'COMPLETED';
                break;
            default:
                statusName = '';
                break;
        }

        await orderService.adminListOrder(statusName)
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    setData(res.data.data)
                    setLoading(false)
                } else {
                    message.error('Error')
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }


    useEffect(() => {
        getListOrder();
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
        <div>
            <Header/>
            <Sidebar/>

            <main id="main" className="main" style={{backgroundColor: "#f6f9ff"}}>
                <div className="pagetitle">
                    <h1>Danh sách đơn hàng</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Đơn hàng</li>
                            <li className="breadcrumb-item active">Danh sách đơn hàng</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="d-flex align-items-center justify-content-between row col-md-12">
                        <div className="mb-3 col-md-3">
                            <h5>Tìm kiếm đơn hàng</h5>
                            <input className="form-control" id="inputSearchOrder" type="text"
                                   placeholder="Nhập thông tin.."/>
                            <br/>
                        </div>

                        <div className="mb-3 col-md-3">
                            <label htmlFor="inputState">Trạng thái</label>
                            <select id="inputState" name="inputState" className="form-control" onChange={selectStatus}>
                                <option value="0">Tất cả</option>
                                <option value="1">CHỜ XÁC NHẬN</option>
                                <option value="2">ĐANG XỬ LÝ</option>
                                <option value="3">ĐÃ XÁC NHẬN</option>
                                <option value="4">ĐANG VẬN CHUYỂN</option>
                                <option value="5">ĐÃ HỦY</option>
                                <option value="6">ĐÃ GIAO HÀNG</option>
                                <option value="7">ĐÃ HOÀN THÀNH</option>
                            </select>
                        </div>
                    </div>
                    <Table
                        style={{margin: "auto"}}
                        columns={columns}
                        dataSource={data}
                        pagination={tableParams.pagination}
                        loading={loading}
                        onChange={handleTableChange}
                    />
                </div>

            </main>
        </div>
    )
}

export default ListOrder
