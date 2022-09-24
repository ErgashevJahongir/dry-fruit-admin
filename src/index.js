import React from "react";
import ReactDOM from "react-dom/client";
import { AxiosInterceptor } from "./Api/Axios";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { DataProvider } from "./Context/DataContext";
import App from "./App";
import "antd/dist/antd.css";
import "./index.css";
import "./antdStyleEdit.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            {/* <DataProvider>
                <AxiosInterceptor> */}
            <App />
            {/* </AxiosInterceptor>
            </DataProvider> */}
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
