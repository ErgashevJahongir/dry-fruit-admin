import axios from "axios";
import { useEffect } from "react";

// const token = JSON.parse(sessionStorage.getItem("token"));

const instance = axios.create({
    baseURL: "https://app-dry-fruits.herokuapp.com/",
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": "uz",
        timeout: 1000,
        // Authorization: `Bearer ${token}`,
    },
});

const AxiosInterceptor = ({ children }) => {
    console.log("interceptor");

    useEffect(() => {
        console.log("useEffect");

        const reqInterceptor = (response) => {
            // if (response.headers === undefined) response.headers = {};
            console.log("reqInterceptor");
            return response;
        };

        const reqErrInterceptor = (error) => {
            console.log("reqErrInterceptor");
            console.log(error);

            return Promise.reject(error);
        };

        const resInterceptor = (response) => {
            console.log("resInterceptor");
            return response;
        };

        const resErrInterceptor = (error) => {
            console.log("resErrInterceptor");
            // if (error?.response?.status === 500) {
            //     // console.log(error);
            //     //redirect logic here
            // }

            return Promise.reject(error);
        };

        const resinterceptor = instance.interceptors.response.use(
            resInterceptor,
            resErrInterceptor
        );

        const reqinterceptor = instance.interceptors.request.use(
            reqInterceptor,
            reqErrInterceptor
        );

        return (
            () => instance.interceptors.response.eject(resinterceptor),
            () => instance.interceptors.request.eject(reqinterceptor)
        );
    }, []);

    return children;
};

export default instance;
export { AxiosInterceptor };
