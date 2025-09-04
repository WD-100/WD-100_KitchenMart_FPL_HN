import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";

const API_ENDPOINT = {
    ADMIN_LIST_ATTRIBUTE: "/api/admin/attribute/list",
    ADMIN_DETAIL_ATTRIBUTE: "/api/admin/attribute/detail/",
    ADMIN_CREATE_ATTRIBUTE: "/api/admin/attribute/create",
    ADMIN_UPDATE_ATTRIBUTE: "/api/admin/attribute/update/",
    ADMIN_DELETE_ATTRIBUTE: "/api/admin/attribute/delete/",
}

class AttributeService {
    adminListAttribute = () => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_LIST_ATTRIBUTE, config);
    }

    adminDetailAttribute = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.get(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DETAIL_ATTRIBUTE + id, config);
    }

    adminCreateAttribute = (data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.ADMIN_CREATE_ATTRIBUTE, data, config);
    }

    adminUpdateAttribute = (id, data) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.patch(BASE_URL_SERVER + API_ENDPOINT.ADMIN_UPDATE_ATTRIBUTE + id, data, config);
    }

    adminDeleteAttribute = (id) => {
        const config = {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.delete(BASE_URL_SERVER + API_ENDPOINT.ADMIN_DELETE_ATTRIBUTE + id, config);
    }
}

const attributeService = new AttributeService();
export default attributeService;