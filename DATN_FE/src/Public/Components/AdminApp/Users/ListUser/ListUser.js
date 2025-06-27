import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Table} from 'antd';
import userService from '../../../Service/UserService';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import $ from 'jquery';

function ListCategory() {
    const handleDelete = async (id) => {
        setLoading(true)
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            await userService.adminDeleteUser(id)
                .then((res) => {
                    console.log("delete", res.data)
                    alert(`Xóa thành công!`)
                    getListUser();
                    setLoading(false)
                })
                .catch((err) => {
                    alert(err.response.data.message)
                    console.log(err);
                    setLoading(false);
                })
        }
        setLoading(false);
    }

    const loadFn = async () => {
        $(document).ready(function () {
            $("#inputSearchCategory").on("input", function () {
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
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên',
            dataIndex: 'full_name',
            width: '15%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone_number',
            width: '15%',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            width: '15%',
        },
        {
            title: 'Quyền hạn',
            dataIndex: 'role_id',
            width: '15%',
            render: (role_id) => {
                return role_id?.name
            },
        },
        {
            title: 'Hành động',
            dataIndex: 'id',
            key: 'x',
            width: '15%',
            render: (id) =>
                <div className="d-flex gap-2 align-items-center justify-content-center">
                    <Link to={`/admin/users/detail/${id}`} className="btn btn-sm btn-primary">
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

    const getListUser = async () => {
        await userService.adminListUser()
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    setData(res.data.data.users)
                    setLoading(false)
                } else {
                    alert('Error')
                    setLoading(false)
                }
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
    }


    useEffect(() => {
        getListUser();
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
                    <h1>Danh sách tài khoản</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Tài khoản</li>
                            <li className="breadcrumb-item active">Danh sách tài khoản</li>
                        </ol>
                    </nav>
                </div>
                {/* End Page Title */}
                <div className="row">
                    <div className="mb-3 col-md-3">
                        <h5>Tìm kiếm danh mục</h5>
                        <input className="form-control" id="inputSearchCategory" type="text"
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

export default ListCategory
