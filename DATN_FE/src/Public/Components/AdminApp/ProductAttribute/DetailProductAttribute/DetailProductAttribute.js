import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import attributeService from "../../../Service/AttributeService";
import productAttributeService from "../../../Service/ProductAttributeService";
import productService from "../../../Service/ProductService";
import Header from "../../../Shared/Admin/Header/Header";
import Sidebar from "../../../Shared/Admin/Sidebar/Sidebar";

function DetailProductAttribute() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);
    const [attributes, setAttributes] = useState([]);

    const [formData, setFormData] = useState({
        product_id: "",
        attribute_id: "",
        price: "",
        sale_price: "",
        quantity: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getListProduct = async () => {
        try {
            const res = await productService.adminListProduct();
            setProducts(res.data.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const getListAttribute = async () => {
        try {
            const res = await attributeService.adminListAttribute();
            setAttributes(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const getDetail = async () => {
        try {
            setLoading(true);
            const res = await productAttributeService.adminDetail(id);

            const data = res.data;

            console.log("detail product attribute", res.data);
            setFormData({
                product_id: data.product_id?.id || data.product_id || "",
                attribute_id: data.attribute_id?._id || data.attribute_id || "",
                price: data.price || "",
                sale_price: data.sale_price || "",
                quantity: data.quantity || "",
            });
        } catch (err) {
            console.error(err);
            message.error("Không thể tải dữ liệu!");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const [key, value] of Object.entries(formData)) {
            if (!value) {
                message.error(`${key} không được bỏ trống!`);
                return;
            }
        }

        try {
            setLoading(true);

            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value);
            });

            const res = await productAttributeService.adminUpdate(id, payload);
            console.log("update product attribute", res.data);

            message.success("Cập nhật thành công!");
            navigate("/admin/product-attributes/list");
        } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListProduct();
        getListAttribute();
        getDetail();
    }, [id]);

    return (
        <>
            <Header />
            <Sidebar />
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>Chỉnh sửa thuộc tính sản phẩm</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link to="/admin/dashboard">Trang quản trị</Link>
                            </li>
                            <li className="breadcrumb-item">Thuộc tính sản phẩm</li>
                            <li className="breadcrumb-item active">Chỉnh sửa</li>
                        </ol>
                    </nav>
                </div>

                <section className="section">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Chỉnh sửa thuộc tính sản phẩm</h5>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="product_id">Lựa chọn sản phẩm</label>
                                                <select
                                                    id="product_id"
                                                    name="product_id"
                                                    className="form-control"
                                                    value={formData.product_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Lựa chọn sản phẩm</option>
                                                    {products.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.title}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group col-md-6">
                                                <label htmlFor="attribute_id">Lựa chọn thuộc tính</label>
                                                <select
                                                    id="attribute_id"
                                                    name="attribute_id"
                                                    className="form-control"
                                                    value={formData.attribute_id}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Lựa chọn thuộc tính</option>
                                                    {attributes.map((a) => (
                                                        <option key={a._id} value={a._id}>
                                                            {a.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="price">Giá cũ</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    id="price"
                                                    name="price"
                                                    className="form-control"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="sale_price">Giá mới</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    id="sale_price"
                                                    name="sale_price"
                                                    className="form-control"
                                                    value={formData.sale_price}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="quantity">Số lượng</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    id="quantity"
                                                    name="quantity"
                                                    className="form-control"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary mt-3"
                                            disabled={loading}
                                        >
                                            {loading ? "Đang lưu..." : "Lưu lại"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}

export default DetailProductAttribute;