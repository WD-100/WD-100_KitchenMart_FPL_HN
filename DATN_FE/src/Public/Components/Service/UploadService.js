import {BASE_URL_SERVER} from "../config/server";
import axios from "axios";


const API_ENDPOINT = {
    API_UPLOAD: '/api/upload/image',
    API_MULTIPLE_UPLOAD: '/api/upload/image/multiple',
}

class UploadService {
    upload = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.API_UPLOAD, data, config);
    }

    multiple = (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`
            }
        };
        return axios.post(BASE_URL_SERVER + API_ENDPOINT.API_MULTIPLE_UPLOAD, data, config);
    }
}

const uploadService = new UploadService();
export default uploadService