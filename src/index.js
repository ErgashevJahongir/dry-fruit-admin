import React from "react";
import ReactDOM from "react-dom/client";
import { AxiosInterceptor } from "./Api/Axios";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./Context/DataContext";
import App from "./App";
import "antd/dist/antd.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AxiosInterceptor>
            <BrowserRouter>
                <DataProvider>
                    <App />
                </DataProvider>
            </BrowserRouter>
        </AxiosInterceptor>
    </React.StrictMode>
);

reportWebVitals();
