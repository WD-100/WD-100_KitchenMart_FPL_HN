import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    NEW_PRODUCT: "/api/product/new-list",
    HOT_PRODUCT: "/api/product/hot-list",
    LIST_PRODUCT: "/api/product/list",
    DETAIL_PRODUCT: "/api/product/detail/",
    SLUG_PRODUCT: "/api/product/slug/",
    /* OPTION PRODUCT */
    LIST_OPTION_PRODUCT: "/api/product-attributes/list-product/",
    DETAIL_OPTION_PRODUCT: "/api/product-attributes/detail/",
    // ADMIN
    ADMIN_LIST_PRODUCT: "/api/admin/product/list",
    ADMIN_DETAIL_PRODUCT: "/api/admin/product/detail/",
    ADMIN_POST_PRODUCT: "/api/admin/product/create",
    ADMIN_UPDATE_PRODUCT: "/api/admin/product/update/",
    ADMIN_DELETE_PRODUCT: "/api/admin/product/delete/",
}

class ProductService {
    // USER
    newProduct = (size, sort) => {
        let params = `?size=${size}&sort=${sort}`;
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.NEW_PRODUCT + params);
    }

    hotProduct = (size, sort) => {
        let params = `?size=${size}&sort=${sort}`;
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.HOT_PRODUCT + params);
    }

    listProduct = (size, sort) => {
        let params = `?size=${size}&sort=${sort}`;
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_PRODUCT + params);
    }

    detailProduct = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_PRODUCT + id);
    }

    slugProduct = (slug) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.SLUG_PRODUCT + slug);
    }

    searchProduct = (category, keyword, size, sort, minPrice, maxPrice, option) => {
        let url = API_ENDPOINT.LIST_PRODUCT + `?category=${category}&keyword=${keyword}&size=${size}&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}&option=${option}`;
        return axios.get(BASE_URL_SERVER + url);
    }

    /* OPTION */
    listOptionProduct = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_OPTION_PRODUCT + id);
    }

    detailOptionProduct = (id) => {
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_OPTION_PRODUCT + id);
    }
    // ADMIN
    adminListProduct = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_PRODUCT, config);
    }

    adminDetailProduct = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_PRODUCT + id, config);
    }

    adminCreateProduct = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_POST_PRODUCT, data, config);
    };

    adminUpdateProduct = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_PRODUCT + id, data, config)
    };

    adminDeleteProduct = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_PRODUCT + id, config);
    }
}

const productService = new ProductService();
export default productService;