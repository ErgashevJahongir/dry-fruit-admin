import axios from "axios";
import { useEffect } from "react";

const token1 = JSON.parse(sessionStorage.getItem("dry-fruit"));
const token2 = JSON.parse(localStorage.getItem("dry-fruit"));
const instance = axios.create({
    baseURL: "http://31.44.5.130:8080/",
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "uz",
        timeout: 10000,
        Authorization: `Bearer ${token1 || token2}`,
    },
});

const AxiosInterceptor = ({ children }) => {
    useEffect(() => {
        const reqInterceptor = (req) => {
            req.headers.Authorization = `Bearer ${token1 || token2}`;
            return req;
        };
        const reqErrInterceptor = (error) => {
            console.error("reqErrInterceptor", error);
            return Promise.reject(error);
        };
        const resInterceptor = (response) => {
            response.headers.Authorization = `Bearer ${token1 || token2}`;
            return response;
        };
        const resErrInterceptor = (error) => {
            console.error("resErrInterceptor", error);
            if (error?.response?.status === 401) {
                if (sessionStorage.getItem("dry-fruit"))
                    sessionStorage.removeItem("dry-fruit", token1);
                if (localStorage.getItem("dry-fruit")) {
                    localStorage.removeItem("dry-fruit", token2);
                }
                window.location.href = "/login";
            }
            return Promise.reject(error);
        };
        const reqinterceptor = instance.interceptors.request.use(
            reqInterceptor,
            reqErrInterceptor
        );
        const resinterceptor = instance.interceptors.response.use(
            resInterceptor,
            resErrInterceptor
        );
        return (
            () => instance.interceptors.request.eject(reqinterceptor),
            () => instance.interceptors.response.eject(resinterceptor)
        );
    }, []);
    return children;
};

export default instance;
export { AxiosInterceptor };
