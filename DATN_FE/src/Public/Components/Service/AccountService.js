import { BASE_URL_SERVER } from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    LOGIN_ACCOUNT: "/api/auth/login",
    REGISTER_ACCOUNT: "/api/auth/register",
    LIST_ACCOUNT: "/api/user/list",
    DETAIL_ACCOUNT: "/api/user/detail/",
    UPDATE_ACCOUNT: "/api/user/update-info/",
    DELETE_ACCOUNT: "/api/user/detail/",
}
class AccountService {

    loginAccount = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.LOGIN_ACCOUNT, data);
    }

    registerAccount = (data) => {
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.REGISTER_ACCOUNT, data);
    }

    listAccount = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.LIST_ACCOUNT, config);
    }

    deleteAccount = (id) => {
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.DELETE_ACCOUNT + id);
    }

    updateAccount = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        console.log(config)
        return axios.put(BASE_URL_SERVER + API_ENDPOINT.UPDATE_ACCOUNT + id, data, config);
    }

    detailAccount = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.DETAIL_ACCOUNT + id, config)
    }
}
const accountService = new AccountService();
export default accountService;