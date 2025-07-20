import React, {useEffect, useState} from 'react'
import Header from '../../../Shared/Admin/Header/Header'
import Sidebar from '../../../Shared/Admin/Sidebar/Sidebar'
import {Table} from 'antd';
import revenueService from '../../../Service/RevenueService';
import {Link} from 'react-router-dom';
import $ from "jquery";
import ConvertCurrency from "../../../Shared/Utils/ConvertCurrency";
import * as echarts from 'echarts';

function ListRevenue() {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
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

    const charts = (xData, yData) => {
        let chartDom = document.getElementById('reportsChart');
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

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            width: '10%',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            width: '60%',
            render: (text) => {
                const date = new Date(text);
                return date.toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });
            },
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

    const getListRevenueChart = async () => {
        await revenueService.adminDataChartRevenue('')
            .then((res) => {
                if (res.status === 200) {
                    console.log("data", res.data)
                    let result = res.data.data;
                    let xData = result.x_data;
                    let yData = result.y_data;
                    charts(xData, yData);
                    setTotal(result.total);
                }
            })
            .catch((err) => {
                console.log(err)
            })
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
                    charts(xData, yData);
                    setTotal(result.total);
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getListRevenueChart();
        getListRevenue();
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
                    <h1>Thống kê doanh thu</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/admin/dashboard">Trang quản trị</Link></li>
                            <li className="breadcrumb-item">Thống kê</li>
                            <li className="breadcrumb-item active">Thống kê doanh thu</li>
                        </ol>
                    </nav>
                </div>

                <div className="row">
                    <div className="col-12 sale_details_ mb-5">
                        <div className="card">
                            <div className="card-body p-3">
                                <h6 className="text-start mb-2">Tổng doanh thu: {ConvertCurrency(total)}</h6>
                                <div className="mb-1 col-md-3">
                                    <label htmlFor="type">Lọc theo:</label>
                                    <select name="type" id="type" className="form-select" onChange={filterRevenueChart}>
                                        <option value="">--- Chọn ---</option>
                                        <option value="day">Ngày</option>
                                        <option value="month">Tháng</option>
                                        <option value="year">Năm</option>
                                    </select>
                                </div>
                                <div id="reportsChart" style={{height: '400px'}}/>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between row col-md-12">
                        <div className="mb-3 col-md-3">
                            <h5>Tìm kiếm</h5>
                            <input className="form-control" id="inputSearchOrder" type="text"
                                   placeholder="Nhập thông tin.."/>
                            <br/>
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

export default ListRevenue
