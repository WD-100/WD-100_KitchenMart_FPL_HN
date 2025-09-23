import { Form, message, Table, Modal, Input, Button } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import ConvertCurrency from "../../../Shared/Utils/ConvertCurrency";
import dayjs from "dayjs";
import useOrderStore from "../../../store/OrderStore";

function DetailOrder() {
    const { id } = useParams();
    const {
        order,
        orderItems,
        orderHistories,
        loading,
        fetchOrder,
        fetchOrderHistories,
        cancelOrder
    } = useOrderStore();

    const [reasonCancel, setReasonCancel] = useState("");
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);

    useEffect(() => {
        fetchOrder(id);
        fetchOrderHistories(id);
    }, [id, fetchOrder, fetchOrderHistories]);

    const handleCancelOrder = async () => {
        if (!reasonCancel.trim()) {
            message.error("Vui lòng nhập lý do huỷ đơn hàng!");
            return;
        }
        try {
            await cancelOrder(id, reasonCancel);
            message.success("Huỷ đơn hàng thành công!");
            setCancelModalVisible(false);
            setReasonCancel("");
        } catch (err) {
            const mess = err.response?.data?.data?.message || "Có lỗi xảy ra";
            message.error("Thất bại: " + mess);
        }
    };

    const statusMap = {
        PENDING: "CHỜ XÁC NHẬN",
        PROCESSING: "ĐANG XỬ LÝ",
        CONFIRMED: "ĐÃ XÁC NHẬN",
        SHIPPING: "ĐANG VẬN CHUYỂN",
        CANCELED: "ĐÃ HỦY",
        DELIVERED: "ĐÃ GIAO HÀNG",
        COMPLETED: "ĐÃ HOÀN THÀNH",
    };

    const methodMap = {
        IMMEDIATE: "Thanh toán khi nhận hàng",
        CARD_CREDIT: "Thanh toán qua VNPAY",
    };

    const columns = [
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (text) => statusMap[text] || "KHÔNG XÁC ĐỊNH",
        },
        {
            title: "Thời gian",
            dataIndex: "created_at",
            width: "20%",
            render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
        },
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main" style={{ backgroundColor: "#f6f9ff" }}>
                <div className="pagetitle">
                    <h1>Chi tiết đơn hàng</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/profile">Người dùng</Link>
                            </li>
                            <li className="breadcrumb-item">Đơn hàng</li>
                            <li className="breadcrumb-item active">Chi tiết đơn hàng</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chi tiết đơn hàng</h5>
                                    <div className="row mb-5">
                                        {/* Thông tin đơn hàng */}
                                        <div className="col-md-4">
                                            <div className="p-3 border">
                                                <table className="table site-block-order-table mb-5">
                                                    <colgroup>
                                                        <col width="40%" />
                                                        <col width="60%" />
                                                    </colgroup>
                                                    <tbody>
                                                    <tr>
                                                        <td className="text-black">Tên đầy đủ</td>
                                                        <td className="text-black">{order.full_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Email</td>
                                                        <td>{order.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Số điện thoại</td>
                                                        <td>{order.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Địa chỉ</td>
                                                        <td>{order.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Phương thức thanh toán</td>
                                                        <td>{methodMap[order.order_method] || "KHÔNG XÁC ĐỊNH"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tổng tiền sản phẩm</td>
                                                        <td>{ConvertCurrency(order.products_price)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Phí vận chuyển</td>
                                                        <td>{ConvertCurrency(order.shipping_price)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Miễn giảm giá</td>
                                                        <td>{ConvertCurrency(order.discount_price)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tổng tiền</td>
                                                        <td>{ConvertCurrency(order.total_price)}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <h5>Ghi chú:</h5>
                                                <div>{order.notes}</div>
                                            </div>
                                        </div>

                                        {/* Sản phẩm và lịch sử */}
                                        <div className="col-md-8">
                                            <div className="p-3 p-lg-5 border">
                                                <table className="table table-bordered mb-3">
                                                    <thead>
                                                    <tr>
                                                        <th>Hình ảnh</th>
                                                        <th>Tên sản phẩm</th>
                                                        <th>Số lượng</th>
                                                        <th>Đơn giá</th>
                                                        <th>Thành tiền</th>
                                                        <th>Hành động</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {orderItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img src={item.image} alt="" width="100px" />
                                                            </td>
                                                            <td>
                                                                {item.title}
                                                                <div>
                                                                    Loại: {item.value.attribute_id.name}
                                                                </div>
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{ConvertCurrency(item.price)}</td>
                                                            <td>{ConvertCurrency(item.price * item.quantity)}</td>
                                                            <td>
                                                                {order.status === "COMPLETED" && (
                                                                    <a
                                                                        className="btn btn-primary"
                                                                        href={`/reviews/products?pro=${item.product_id}&order=${id}`}
                                                                    >
                                                                        Đánh giá
                                                                    </a>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>

                                                <div className="mt-3 mb-2">Lịch sử đơn hàng</div>
                                                <Table
                                                    columns={columns}
                                                    dataSource={orderHistories}
                                                    pagination={false}
                                                    loading={loading}
                                                    rowKey="_id"
                                                />
                                            </div>

                                            {/* Tiến trình đơn hàng */}
                                            <div className="row mt-3 mb-4">
                                                <div id="bar-progress" className="mt-5 mt-lg-0">
                                                    {[
                                                        "PENDING",
                                                        "PROCESSING",
                                                        "CONFIRMED",
                                                        "SHIPPING",
                                                        "DELIVERED",
                                                        "COMPLETED",
                                                    ].map((step, index) => (
                                                        <React.Fragment key={step}>
                                                            <div
                                                                className={`step ${
                                                                    order.status === step ? "step-active" : ""
                                                                }`}
                                                            >
                                                                <span className="number-container">
                                                                    <span className="number">{index + 1}</span>
                                                                </span>
                                                                <h5>{statusMap[step]}</h5>
                                                            </div>
                                                            {index < 5 && <div className="seperator"></div>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Nút Hủy đơn */}
                                            {["PENDING", "PROCESSING", "CONFIRMED"].includes(order.status) && (
                                                <Button danger onClick={() => setCancelModalVisible(true)}>
                                                    Hủy đơn hàng
                                                </Button>
                                            )}

                                            {order.reason_cancel && (
                                                <>
                                                    <h5 className="mt-2">Lý do huỷ đơn hàng:</h5>
                                                    <div className="text-danger">{order.reason_cancel}</div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal AntD */}
            <Modal
                title="Huỷ đơn hàng"
                open={isCancelModalVisible}
                onCancel={() => setCancelModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setCancelModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button key="submit" type="primary" danger onClick={handleCancelOrder}>
                        Xác nhận huỷ đơn hàng
                    </Button>,
                ]}
            >
                <Input.TextArea
                    rows={4}
                    placeholder="Vui lòng nhập lý do huỷ đơn hàng..."
                    value={reasonCancel}
                    onChange={(e) => setReasonCancel(e.target.value)}
                />
            </Modal>
        </>
    );
}

export default DetailOrder;