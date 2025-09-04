import React, { useEffect, useState } from "react";
import { Form, message, Table, Modal, Input, Button } from "antd";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

import useOrderStore from "../../../store/OrderStore";
import Header from "../../../Shared/Admin/Header/Header";
import Sidebar from "../../../Shared/Admin/Sidebar/Sidebar";
import ConvertCurrency from "../../../Shared/Utils/ConvertCurrency";

// Component hiển thị tiến trình đơn hàng
function OrderProgress({ status }) {
    const steps = [
        { key: "PENDING", label: "CHỜ XÁC NHẬN" },
        { key: "PROCESSING", label: "ĐANG XỬ LÝ" },
        { key: "CONFIRMED", label: "ĐÃ XÁC NHẬN" },
        { key: "SHIPPING", label: "ĐANG VẬN CHUYỂN" },
        { key: "DELIVERED", label: "ĐÃ GIAO HÀNG" },
        { key: "COMPLETED", label: "ĐÃ HOÀN THÀNH" },
    ];

    return (
        <div id="bar-progress" className="mt-5 mt-lg-0 d-flex align-items-center">
            {steps.map((step, index) => (
                <React.Fragment key={step.key}>
                    <div className={`step ${status === step.key ? "step-active" : ""}`}>
                        <span className="number-container">
                            <span className="number">{index + 1}</span>
                        </span>
                        <h5>{step.label}</h5>
                    </div>
                    {index < steps.length - 1 && <div className="seperator"></div>}
                </React.Fragment>
            ))}
        </div>
    );
}

function DetailOrder() {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [reasonCancel, setReasonCancel] = useState("");
    const [isCancelModalVisible, setCancelModalVisible] = useState(false);

    const {
        order,
        orderItems,
        orderHistories,
        loading,
        fetchOrder,
        fetchOrderHistories,
        updateOrderStatus,
        cancelOrder,
    } = useOrderStore();

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

    useEffect(() => {
        fetchOrder(id);
        fetchOrderHistories(id);
    }, [id, fetchOrder, fetchOrderHistories]);

    // Xác nhận chuyển trạng thái
    const handleUpdateOrder = () => {
        Modal.confirm({
            title: "Xác nhận thay đổi trạng thái",
            onOk: async () => {
                try {
                    await updateOrderStatus(id, { status: null });
                    message.success("Thay đổi trạng thái thành công!");
                } catch (err) {
                    message.error("Thất bại: " + (err.message || "Lỗi không xác định"));
                }
            },
        });
    };

    // Hủy đơn hàng
    const handleCancelOrder = async () => {
        if (!reasonCancel.trim()) {
            message.error("Vui lòng nhập lý do hủy đơn hàng");
            return;
        }
        try {
            await cancelOrder(id, reasonCancel);
            setCancelModalVisible(false);
            setReasonCancel("");
            message.success("Hủy đơn hàng thành công!");
        } catch (err) {
            message.error("Thất bại: " + (err.message || "Lỗi không xác định"));
        }
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
                                <Link to="/admin/dashboard">Trang quản trị</Link>
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
                                        {/* Thông tin khách hàng */}
                                        <div className="col-md-4">
                                            <div className="p-3 border">
                                                <table className="table site-block-order-table mb-5">
                                                    <tbody>
                                                    <tr>
                                                        <td>Tên đầy đủ</td>
                                                        <td>{order?.full_name}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Email</td>
                                                        <td>{order?.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>SĐT</td>
                                                        <td>{order?.phone}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Địa chỉ</td>
                                                        <td>{order?.address}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Phương thức</td>
                                                        <td>
                                                            {methodMap[order?.order_method] ||
                                                                "KHÔNG XÁC ĐỊNH"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tổng tiền SP</td>
                                                        <td>
                                                            {ConvertCurrency(order?.products_price)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Phí vận chuyển</td>
                                                        <td>
                                                            {ConvertCurrency(order?.shipping_price)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Giảm giá</td>
                                                        <td>
                                                            {ConvertCurrency(order?.discount_price)}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tổng cộng</td>
                                                        <td>
                                                            {ConvertCurrency(order?.total_price)}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <h5>Ghi chú:</h5>
                                                <div className="notes">{order?.note}</div>
                                            </div>
                                        </div>

                                        {/* Danh sách sản phẩm */}
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
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {orderItems.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img
                                                                    src={item.image}
                                                                    alt=""
                                                                    width="100px"
                                                                />
                                                            </td>
                                                            <td>
                                                                {item.title}
                                                                <div>
                                                                    Loại:{" "}
                                                                    {item.value?.attribute_id?.name}
                                                                </div>
                                                            </td>
                                                            <td>{item.quantity}</td>
                                                            <td>{ConvertCurrency(item.price)}</td>
                                                            <td>
                                                                {ConvertCurrency(
                                                                    item.price * item.quantity
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>

                                                <h5 className="mb-2">Lịch sử đơn hàng</h5>
                                                <Table
                                                    style={{ margin: "auto" }}
                                                    columns={columns}
                                                    dataSource={orderHistories}
                                                    pagination={{ pageSize: 10 }}
                                                    loading={loading}
                                                    rowKey="_id"
                                                />
                                            </div>

                                            {/* Tiến trình đơn hàng */}
                                            <OrderProgress status={order?.status} />

                                            {/* Action */}
                                            {order?.status !== "CANCELED" &&
                                                order?.status !== "COMPLETED" && (
                                                    <div className="d-flex gap-3 mt-3">
                                                        <Button
                                                            type="primary"
                                                            onClick={handleUpdateOrder}
                                                        >
                                                            Chuyển trạng thái
                                                        </Button>
                                                        {(order?.status === "PENDING" ||
                                                            order?.status === "PROCESSING" ||
                                                            order?.status === "CONFIRMED") && (
                                                            <Button
                                                                danger
                                                                onClick={() =>
                                                                    setCancelModalVisible(true)
                                                                }
                                                            >
                                                                Hủy đơn hàng
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}

                                            {order?.reason_cancel && (
                                                <>
                                                    <h5 className="mt-2">Lý do huỷ đơn:</h5>
                                                    <div className="text-danger">
                                                        {order.reason_cancel}
                                                    </div>
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

            {/* Modal hủy đơn hàng */}
            <Modal
                title="Huỷ đơn hàng"
                open={isCancelModalVisible}
                onCancel={() => setCancelModalVisible(false)}
                footer={[
                    <Button
                        key="back"
                        onClick={() => setCancelModalVisible(false)}
                    >
                        Đóng
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleCancelOrder}
                    >
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
