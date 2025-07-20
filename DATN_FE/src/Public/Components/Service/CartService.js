import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LIST_CART: "/api/cart/list/",
    CREATE_CART: "/api/cart/add",
    UPDATE_CART: "/api/cart/update/",
    DELETE_CART: "/api/cart/delete/",
    CLEAR_CART: "/api/cart/clear/",
}

class CartService {
    listCart = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        const user_id = sessionStorage.getItem("id");
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_CART + user_id, config);
    }

    createCart = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.CREATE_CART, data, config);
    }

    updateCart = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.put(BASE_URL_SERVER + API_ENDPOINT.UPDATE_CART + id, data, config);
    }

    deleteCart = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.DELETE_CART + id, config);
    }

    clearCart = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        const user_id = sessionStorage.getItem("id");
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.CLEAR_CART + user_id, config);
    }
}

const cartService = new CartService();
export default cartService;