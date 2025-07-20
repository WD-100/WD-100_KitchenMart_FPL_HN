import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    /* My coupon*/
    LIST_MY: "/api/my-coupons/list",
    SEARCH_MY: "/api/my-coupons/search",
    DETAIL_MY: "/api/my-coupons/detail/",
    //
    LIST: "/api/coupons/list",
    SEARCH: "/api/coupons/search",
    DETAIL: "/api/coupons/detail/",
    /* Save coupon */
    SAVE: "/api/my-coupons/save",
    //
    ADMIN_LIST: "/api/admin/coupons/list",
    ADMIN_DETAIL: "/api/admin/coupons/detail/",
    ADMIN_CREATE: "/api/admin/coupons/create",
    ADMIN_UPDATE: "/api/admin/coupons/update/",
    ADMIN_DELETE: "/api/admin/coupons/delete/",
}

class CouponService {
    //
    listMyCoupon = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_MY, config);
    }

    searchMyCoupon = (code) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.SEARCH_MY + '?name=&code=' + code, config);
    }

    detailMyCoupon = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_MY + id, config);
    }

    saveCoupon = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.SAVE, data, config);
    }
    //
    listCoupon = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST, config);
    }

    searchCoupon = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.SEARCH, config);
    }

    detailCoupon = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL + id, config);
    }
    //
    adminListCoupon = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST, config);
    }

    adminDetailCoupon = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL + id, config);
    }

    adminCreateCoupon = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE, data, config);
    }

    adminUpdateCoupon = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE + id, data, config);
    }

    adminDeleteCoupon = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE + id, config);
    }
}

const couponService = new CouponService();
export default couponService;