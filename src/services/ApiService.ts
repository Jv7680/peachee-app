import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { store } from "../redux/store";
import { resetState } from "../redux/utilActions";
import { LocalStorage } from "./storageService";

export interface ResponseData<T> {
    status: number;
    code: number;
    message: string;
    data: T;
};

const handleRequestInterceptor = async (config: InternalAxiosRequestConfig<any>) => {
    // set token header
    // config.headers.authorization = LocalStorage.getToken() || "";
    return config;
};

const handleErrorRequestInterceptor = async (error: any) => {
    console.log("request interceptors error", error);
    return error;
};

const handleResponeInterceptor = async (response: AxiosResponse<any, any>) => {
    console.log("data interceptors respone", response);
    console.log(`Call API ${response.config.url} success`);

    const data: ResponseData<any> = response.data;

    // login success
    if (data.code === 202) {
        LocalStorage.setToken(data.data.accessToken);
        LocalStorage.setRefreshToken(data.data.refreshToken);
    }

    if (![203, 204, 207, 209, 210].find(element => element === data.code)) {
        let userSetting = JSON.parse(LocalStorage.getUserSetting() || "");
    }

    return response;
};

const handleErrorResponeInterceptor = async (error: any) => {
    console.log("error interceoptor", error);
    console.log("error response interceoptor", error.response);

    // cannot connect to server
    if (error && !error.response) {
        // return toast.error(i18TFunc("alert:errorServer"));
    }

    // api not exist
    if (error && error.response.status === 404) {
        return;
    }

    const data: ResponseData<any> = error.response.data;

    if (![403, 406, 407, 408, 409, 410, 411, 412, 413, 414, 417, 422, 424, 425].find(element => element === data.code)) {
        let userSetting = JSON.parse(LocalStorage.getUserSetting() || "");
        if (userSetting?.language === "vi") {
            // toast.error(errorStatusMsgVI[(data.code as keyof typeof errorStatusMsgVI)]);
        }
        else if (userSetting?.language === "en") {
            // toast.error(errorStatusMsgEN[(data.code as keyof typeof errorStatusMsgEN)]);
        }
    }

    return error.response;
};

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    // baseURL: "https://peachee-app-server.vercel.app",
    timeout: 100000,
    headers: {
        "Content-Type": "application/json"
    }
});
// request interceptor
axiosInstance.interceptors.request.use(handleRequestInterceptor, handleErrorRequestInterceptor);
// response interceptor
axiosInstance.interceptors.response.use(handleResponeInterceptor, handleErrorResponeInterceptor);

// support function
const handleCallAPI = async (axiosMethod: Function, url: string, body: any = undefined) => {
    try {
        // store.dispatch(setIsLoading(true));
        if (!body) {
            let result = (await axiosMethod(url)).data;
            return result;
        }
        else {
            let result = (await axiosMethod(url, body)).data;
            return result;
        }
    }
    catch (error) {
        console.log("error in handleCallAPI", error);
    }
    finally {
        // store.dispatch(setIsLoading(false));
    }
};

const APIService = {
    get: async (url: string) => await handleCallAPI(axiosInstance.get, url),
    post: async (url: string, body: any) => await handleCallAPI(axiosInstance.post, url, body),
    put: async (url: string, body: any) => await handleCallAPI(axiosInstance.put, url, body),
    patch: async (url: string, body: any) => await handleCallAPI(axiosInstance.patch, url, body),
    delete: async (url: string, body: any) => await handleCallAPI(axiosInstance.delete, url, body),
};

export default APIService;