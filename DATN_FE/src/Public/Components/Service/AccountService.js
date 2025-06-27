import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    //
    GET_USER_INFO: "/api/user/me",
    //
    UPDATE_ACCOUNT: "/api/user/update-profile",
    CHANGE_PASSWORD_ACCOUNT: "/api/user/change-password",
}

class AccountService {
    getInfo = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };

        return axios.get(BASE_URL_SERVER + API_ENDPOINT.GET_USER_INFO, config);
    }

    updateAccount = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.UPDATE_ACCOUNT, data, config);
    }

    changePassAccount = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.CHANGE_PASSWORD_ACCOUNT, data, config);
    }
}

const accountService = new AccountService();
export default accountService;