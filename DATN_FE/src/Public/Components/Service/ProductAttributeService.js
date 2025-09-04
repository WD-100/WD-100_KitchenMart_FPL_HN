import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    /* Client route */
    LIST_ATTRIBUTE_BY_PRODUCT: "/api/product-attributes/list-product/",
    DETAIL_ATTRIBUTE: "/api/product-attributes/detail/",

    /* Admin route */
    ADMIN_LIST_ATTRIBUTE: "/api/admin/product-attributes/list",
    ADMIN_DETAIL_ATTRIBUTE: "/api/admin/product-attributes/detail/",
    ADMIN_CREATE_ATTRIBUTE: "/api/admin/product-attributes/create",
    ADMIN_UPDATE_ATTRIBUTE: "/api/admin/product-attributes/update/",
    ADMIN_DELETE_ATTRIBUTE: "/api/admin/product-attributes/delete/",
}

class ProductAttributeService {
    /* Client route */
    listByProduct = () => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_ATTRIBUTE, config);
    }

    detail = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_ATTRIBUTE + id, config);
    }

    /* Admin route */
    adminList = () => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_ATTRIBUTE, config);
    }

    adminDetail = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_ATTRIBUTE + id, config);
    }

    adminCreate = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE_ATTRIBUTE, data, config);
    }

    adminUpdate = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_ATTRIBUTE + id, data, config);
    }

    adminDelete = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_ATTRIBUTE + id, config);
    }
}

const productAttributeService = new ProductAttributeService();
export default productAttributeService;