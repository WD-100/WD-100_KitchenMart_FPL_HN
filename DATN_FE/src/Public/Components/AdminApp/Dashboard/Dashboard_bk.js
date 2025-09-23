import React, {useEffect, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom';
import Header from '../../Shared/Admin/Header/Header';
import Sidebar from '../../Shared/Admin/Sidebar/Sidebar';
import Footer from '../../Shared/Admin/Footer/Footer';
import adminService from "../../Service/AdminService";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import ECharts from "echarts";
import * as echarts from 'echarts';
import $ from "jquery";
import revenueService from "../../Service/RevenueService";
import {Table} from "antd";
import dayjs from "dayjs";
import orderService from "../../Service/OrderService";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [dataOrder, setDataOrder] = useState([]);
    const [revenues, setRevenue] = useState([]);

    const chartRevenus = (xData, yData) => {
        let chartDom = document.getElementById('reportRevenuesChart');
        let myChart = echarts.init(chartDom);

        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Tổng số tiền',
                    type: 'bar',
                    barWidth: '60%',
                    data: yData
                }
            ]
        };
        myChart.setOption(option);
        myChart.resize();
    }

    const filterRevenueChart = async () => {
        let type = $('#type').val();
        await revenueService.adminDataChartRevenue(type)
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    let result = res.data.data;
                    let xData = result.x_data;
                    let yData = result.y_data;
                    chartRevenus(xData, yData);
                    setTotal(result.total);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const charts = (dataChart) => {
        const chartDom = document.getElementById('reportsChart');
        const myChart = echarts.init(chartDom);

        const option = {
            title: {
                text: 'Tỉ lệ đơn hàng',
                subtext: 'Tính theo %',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Tỉ lệ đơn hàng',
                    type: 'pie',
                    radius: '50%',
                    data: dataChart,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        myChart.resize();
    }

    const homeDashboard = async () => {
        try {
            const res = await adminService.adminDashboard('', '', '', '');
            if (res.status === 200) {
                console.log('data: ', res.data);
                setData(res.data.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const isIncreaseOrder = data.order_action ? data.order_action.is_increase : false;
    const changeClassOrder = isIncreaseOrder ? "text-success" : "text-danger";
    const changeTextOrder = isIncreaseOrder ? "tăng" : "giảm";

    const isIncrease = data.revenue_action ? data.revenue_action.is_increase : false;
    const changeClass = isIncrease ? "text-success" : "text-danger";
    const changeText = isIncrease ? "tăng" : "giảm";

    const isIncreaseMember = data.member_action ? data.member_action.is_increase : false;
    const changeClassMember = isIncreaseMember ? "text-success" : "text-danger";
    const changeTextMember = isIncreaseMember ? "tăng" : "giảm";

    const renderChart = async (type) => {
        try {
            const res = await adminService.adminChartOrder(type);
            if (res.status === 200) {
                console.log('data: ', res.data);

                let data = res.data.data;

                let dataChart = [
                    {value: data.canceled, name: 'Đã huỷ'},
                    {value: data.completed, name: 'Đã hoàn thành'},
                ];

                charts(dataChart);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const getListOrder = async () => {
        await orderService.adminListOrder('', 10)
            .then((res) => {
                console.log(res.data.data)
                setDataOrder(res.data.data)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
                console.log(err)
            })
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

    const columnOrders = [
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            width: '60%',
            render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Tổng tiền ',
            dataIndex: 'total',
            width: 'x',
            key: 'x',
            render: (text, record, index) => {
                return (
                    <>
                        {ConvertCurrency(text)}
                    </>
                );
            },
        },
    ];

    const getListRevenue = async () => {
        await revenueService.adminListRevenue('', '', '')
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    setRevenue(res.data.data)
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

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const handleTableChangeOrders = (pagination, filters, sorter) => {
        setTableParamOrders({
            pagination,
            filters,
            ...sorter,
        });
    };

    const [tableParamOrders, setTableParamOrders] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    useEffect(() => {
        homeDashboard();
        renderChart('');
        filterRevenueChart();
        getListRevenue();
        getListOrder();
        loadFn();
    }, []);

    return (
        <>
            <Header/>
            <Sidebar/>
            <main id="main" className="main" style={{backgroundColor: "#f6f9ff"}}>
                <div className="pagetitle">
                    <h1>Trang quản trị</h1>
                </div>
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="row">
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card sales-card">
                                        <div className="filter">
                                            <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                                className="bi bi-three-dots"/></Link>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Bộ lọc</h6>
                                                </li>
                                                <li><Link className="dropdown-item" to="#">Hôm nay</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong tháng</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong năm</Link></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">Đơn hàng <span>| Trong tháng</span></h5>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-cart"/>
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{data.order_action ? data.order_action.current_order : 0}</h6>
                                                    <>
                                                        <span className={`${changeClassOrder} small pt-1 fw-bold`}>
                                                            {data.order_action ? data.order_action.percent_change : 0}%
                                                        </span>
                                                        <span className="text-muted small pt-2 ps-1">
                                                            {changeTextOrder}
                                                        </span>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card info-card revenue-card">
                                        <div className="filter">
                                            <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                                className="bi bi-three-dots"/></Link>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Bộ lọc</h6>
                                                </li>
                                                <li><Link className="dropdown-item" to="#">Hôm nay</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong tháng</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong năm</Link></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">Doanh thu <span>| Trong tháng</span></h5>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-currency-dollar"/>
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{ConvertCurrency(data.revenue_action ? data.revenue_action.current_total_revenue : 0)}</h6>
                                                    <>
                                                        <span className={`${changeClass} small pt-1 fw-bold`}>
                                                            {data.revenue_action ? data.revenue_action.percent_change : 0}%
                                                        </span>
                                                        <span className="text-muted small pt-2 ps-1">
                                                            {changeText}
                                                        </span>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-xl-12">
                                    <div className="card info-card customers-card">
                                        <div className="filter">
                                            <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                                className="bi bi-three-dots"/></Link>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Bộ lọc</h6>
                                                </li>
                                                <li><Link className="dropdown-item" to="#">Hôm nay</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong tháng</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong năm</Link></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">Khách hàng <span>| Trong tháng</span></h5>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                                    <i className="bi bi-people"/>
                                                </div>
                                                <div className="ps-3">
                                                    <h6>{data.member_action ? data.member_action.current_member : 0}</h6>
                                                    <>
                                                        <span className={`${changeClassMember} small pt-1 fw-bold`}>
                                                            {data.member_action ? data.member_action.percent_change : 0}%
                                                        </span>
                                                        <span className="text-muted small pt-2 ps-1">
                                                            {changeTextMember}
                                                        </span>
                                                    </>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 sale_details_ mb-5">
                                    <div className="card">
                                        <div className="card-body p-3">
                                            <h6 className="text-start mb-2">Tổng doanh
                                                thu: {ConvertCurrency(total)}</h6>
                                            <div className="mb-1 col-md-3">
                                                <label htmlFor="type">Lọc theo:</label>
                                                <select name="type" id="type" className="form-select"
                                                        onChange={filterRevenueChart}>
                                                    <option value="">--- Chọn ---</option>
                                                    <option value="day">Ngày</option>
                                                    <option value="month">Tháng</option>
                                                    <option value="year">Năm</option>
                                                </select>
                                            </div>
                                            <div id="reportRevenuesChart" style={{height: '400px'}}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <Table
                                        style={{margin: "auto"}}
                                        columns={columns}
                                        dataSource={revenues}
                                        pagination={tableParams.pagination}
                                        loading={loading}
                                        onChange={handleTableChange}
                                    />
                                </div>

                                <div className="col-12">
                                    <Table
                                        style={{margin: "auto"}}
                                        columns={columnOrders}
                                        dataSource={dataOrder}
                                        pagination={tableParamOrders.pagination}
                                        loading={loading}
                                        onChange={handleTableChangeOrders}
                                    />
                                </div>

                                <div className="col-12">
                                    <div className="card top-selling overflow-auto">
                                        <div className="filter">
                                            <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                                className="bi bi-three-dots"/></Link>
                                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                                <li className="dropdown-header text-start">
                                                    <h6>Bộ lọc</h6>
                                                </li>
                                                <li><Link className="dropdown-item" to="#">Hôm nay</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong tháng</Link></li>
                                                <li><Link className="dropdown-item" to="#">Trong năm</Link></li>
                                            </ul>
                                        </div>
                                        <div className="card-body pb-0">
                                            <h5 className="card-title">Bán chạy nhất <span>| Hôm nay</span></h5>
                                            <table className="table table-borderless">
                                                <colgroup>
                                                    <col style={{width: "10%"}}/>
                                                    <col style={{width: "x"}}/>
                                                    <col style={{width: "10%"}}/>
                                                    <col style={{width: "10%"}}/>
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th scope="col">Hình ảnh</th>
                                                    <th scope="col">Tên sản phẩm</th>
                                                    <th scope="col">Giá mới</th>
                                                    <th scope="col">Số lượng đã mua</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {data.product_action ? data.product_action.top_products.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <th scope="row"><img
                                                                src={item.image}
                                                                alt=""/></th>
                                                            <td>{item.title}</td>
                                                            <td>{ConvertCurrency(item.sale_price)}</td>
                                                            <td>{item.total_sold}</td>
                                                        </tr>
                                                    )
                                                }) : ''}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="filter">
                                    <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                        className="bi bi-three-dots"/></Link>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                        <li className="dropdown-header text-start">
                                            <h6>Bộ lọc</h6>
                                        </li>
                                        <li><Link className="dropdown-item" to="#">Hôm nay</Link></li>
                                        <li><Link className="dropdown-item" to="#">Trong tháng</Link></li>
                                        <li><Link className="dropdown-item" to="#">Trong năm</Link></li>
                                    </ul>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">Tỉ lệ đơn hàng <span>| Hôm nay</span></h5>
                                    <div id="reportsChart" style={{height: '600px'}}/>
                                </div>
                            </div>
                            <div className="card">
                                <div className="filter">
                                    <Link className="icon" to="#" data-bs-toggle="dropdown"><i
                                        className="bi bi-three-dots"/></Link>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                        <li className="dropdown-header text-start">
                                            <h6>Bộ lọc</h6>
                                        </li>
                                        <li><Link className="dropdown-item" to="#"
                                                  onClick={() => renderChart('day')}>Hôm nay</Link></li>
                                        <li><Link className="dropdown-item" to="#"
                                                  onClick={() => renderChart('month')}>Trong tháng</Link></li>
                                        <li><Link className="dropdown-item" to="#"
                                                  onClick={() => renderChart('year')}>Trong năm</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    )
}

export default Dashboard;
