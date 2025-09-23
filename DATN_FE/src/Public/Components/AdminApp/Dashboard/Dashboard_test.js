import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../Shared/Admin/Header/Header";
import Sidebar from "../../Shared/Admin/Sidebar/Sidebar";
import Footer from "../../Shared/Admin/Footer/Footer";
import adminService from "../../Service/AdminService";
import ConvertCurrency from "../../Shared/Utils/ConvertCurrency";
import * as echarts from "echarts";
import revenueService from "../../Service/RevenueService";
import { Table, Input } from "antd";
import dayjs from "dayjs";
import orderService from "../../Service/OrderService";

function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState({});
    const [dataOrder, setDataOrder] = useState([]);
    const [revenues, setRevenue] = useState([]);
    const [searchOrder, setSearchOrder] = useState("");
    const [revenueType, setRevenueType] = useState("");

    const revenueChartRef = useRef(null);
    const orderChartRef = useRef(null);

    // ========== CHART FUNCTIONS ==========
    const renderRevenueChart = (xData, yData) => {
        if (!revenueChartRef.current) return;
        const myChart = echarts.init(revenueChartRef.current);
        const option = {
            tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: [{ type: "category", data: xData, axisTick: { alignWithLabel: true } }],
            yAxis: [{ type: "value" }],
            series: [{ name: "Tổng số tiền", type: "bar", barWidth: "60%", data: yData }]
        };
        myChart.setOption(option);
        myChart.resize();
    };

    const renderOrderChart = (dataChart) => {
        if (!orderChartRef.current) return;
        const myChart = echarts.init(orderChartRef.current);
        const option = {
            title: { text: "Tỉ lệ đơn hàng", subtext: "Tính theo %", left: "center" },
            tooltip: { trigger: "item" },
            legend: { orient: "vertical", left: "left" },
            series: [
                {
                    name: "Tỉ lệ đơn hàng",
                    type: "pie",
                    radius: "50%",
                    data: dataChart,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        myChart.resize();
    };

    // ========== API CALLS ==========
    const fetchDashboard = async () => {
        try {
            const res = await adminService.adminDashboard();
            if (res.status === 200) setData(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenueChart = async (type = "") => {
        try {
            const res = await revenueService.adminDataChartRevenue(type);
            if (res.status === 200) {
                const result = res.data.data;
                renderRevenueChart(result.x_data, result.y_data);
                setTotal(result.total);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrderChart = async (type = "") => {
        try {
            const res = await adminService.adminChartOrder(type);
            if (res.status === 200) {
                const d = res.data.data;
                renderOrderChart([
                    { value: d.canceled, name: "Đã huỷ" },
                    { value: d.completed, name: "Đã hoàn thành" }
                ]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await orderService.adminListOrder("", 10);
            if (res.status === 200) setDataOrder(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRevenues = async () => {
        try {
            const res = await revenueService.adminListRevenue("", "", "");
            if (res.status === 200) setRevenue(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ========== EFFECTS ==========
    useEffect(() => {
        fetchDashboard();
        fetchOrderChart();
        fetchRevenueChart();
        fetchRevenues();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (revenueType) fetchRevenueChart(revenueType);
    }, [revenueType]);

    // ========== TABLE CONFIG ==========
    const statusMap = {
        PENDING: "CHỜ XÁC NHẬN",
        PROCESSING: "ĐANG XỬ LÝ",
        CONFIRMED: "ĐÃ XÁC NHẬN",
        SHIPPING: "ĐANG VẬN CHUYỂN",
        CANCELED: "ĐÃ HỦY",
        DELIVERED: "ĐÃ GIAO HÀNG",
        COMPLETED: "ĐÃ HOÀN THÀNH"
    };

    const filteredOrders = dataOrder.filter((item) =>
        Object.values(item).some((val) =>
            String(val).toLowerCase().includes(searchOrder.toLowerCase())
        )
    );

    const columnOrders = [
        { title: "STT", render: (_, __, i) => i + 1 },
        { title: "Tên đầy đủ", dataIndex: "full_name" },
        { title: "Số điện thoại", dataIndex: "phone" },
        { title: "Email", dataIndex: "email" },
        { title: "Địa chỉ", dataIndex: "address" },
        { title: "Tổng tiền", dataIndex: "total_price", render: ConvertCurrency },
        { title: "Trạng thái", dataIndex: "status", render: (t) => statusMap[t] || "KHÔNG XÁC ĐỊNH" },
        {
            title: "Hành động",
            render: (_, record) => (
                <Link to={`/admin/orders/detail/${record._id}`} className="btn btn-primary">
                    Xem chi tiết
                </Link>
            )
        }
    ];

    const revenueColumns = [
        { title: "STT", render: (_, __, i) => i + 1 },
        { title: "Thời gian", dataIndex: "createdAt", render: (t) => dayjs(t).format("DD/MM/YYYY HH:mm") },
        { title: "Tổng tiền", dataIndex: "total", render: ConvertCurrency }
    ];

    // ========== UI ==========
    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main" style={{ backgroundColor: "#f6f9ff" }}>
                <div className="pagetitle">
                    <h1>Trang quản trị</h1>
                </div>
                <section className="section dashboard">
                    <div className="row">
                        <div className="col-lg-8">
                            {/* Chart doanh thu */}
                            <div className="col-12 sale_details_ mb-5">
                                <div className="card">
                                    <div className="card-body p-3">
                                        <h6>Tổng doanh thu: {ConvertCurrency(total)}</h6>
                                        <div className="mb-1 col-md-3">
                                            <label htmlFor="type">Lọc theo:</label>
                                            <select
                                                id="type"
                                                className="form-select"
                                                value={revenueType}
                                                onChange={(e) => setRevenueType(e.target.value)}
                                            >
                                                <option value="">--- Chọn ---</option>
                                                <option value="day">Ngày</option>
                                                <option value="month">Tháng</option>
                                                <option value="year">Năm</option>
                                            </select>
                                        </div>
                                        <div ref={revenueChartRef} style={{ height: "400px" }} />
                                    </div>
                                </div>
                            </div>

                            {/* Bảng revenue */}
                            <div className="col-12">
                                <Table
                                    columns={revenueColumns}
                                    dataSource={revenues}
                                    rowKey="_id"
                                    pagination={{ pageSize: 10 }}
                                    loading={loading}
                                />
                            </div>

                            {/* Search và Bảng orders */}
                            <div className="col-12">
                                <Input.Search
                                    placeholder="Tìm kiếm đơn hàng"
                                    allowClear
                                    style={{ marginBottom: 12, maxWidth: 300 }}
                                    onChange={(e) => setSearchOrder(e.target.value)}
                                />
                                <Table
                                    columns={columnOrders}
                                    dataSource={filteredOrders}
                                    rowKey="_id"
                                    pagination={{ pageSize: 10 }}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        {/* Chart đơn hàng */}
                        <div className="col-lg-4">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Tỉ lệ đơn hàng</h5>
                                    <div ref={orderChartRef} style={{ height: "600px" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Dashboard;
