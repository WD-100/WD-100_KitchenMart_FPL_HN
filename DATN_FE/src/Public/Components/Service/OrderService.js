import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LIST_ORDER: "/api/order/list",
    DETAIL_ORDER: "/api/order/detail/",
    CREATE_ORDER: "/api/checkout/create",
    QUICK_ORDER: "/api/checkout/quick-order",
    QUICK_ORDER_VNPAY: "/api/checkout/quick-order-vnpay",
    CREATE_ORDER_VNPAY: "/api/checkout/checkout_vnpay",
    CANCEL_ORDER: "/api/order/cancel/",
    // ADMIN
    ADMIN_LIST_ORDER: "/api/admin/order/list",
    ADMIN_DETAIL_ORDER: "/api/admin/order/detail/",
    ADMIN_UPDATE_ORDER: "/api/admin/order/update/",
    // HISTORY
    HISTORY_ORDER: "/api/order-history/list",
}

class OrderService {
    // USER
    listOrder = (status) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_ORDER + '?status=' + status, config);
    }

    detailOrder = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_ORDER + id, config);
    }

    createOrder = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.CREATE_ORDER, data, config);
    }

    createQuickOrder = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.QUICK_ORDER, data, config);
    }

    createQuickOrderVnpay = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.QUICK_ORDER_VNPAY, data, config);
    }

    createOrderVnpay = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.CREATE_ORDER_VNPAY, data, config);
    }

    cancelOrder = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.CANCEL_ORDER + id, data, config);
    }


    // ADMIN
    adminListOrder = (status) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_ORDER + '?status=' + status, config);
    }

    adminDetailOrder = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_ORDER + id, config);
    }

    adminUpdateOrder = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_ORDER + id, data, config)
    }
    // HISTORY
    listOrderHistories = (order_id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.HISTORY_ORDER + '?order_id=' + order_id, config);
    }
}

const orderService = new OrderService();
export default orderService;