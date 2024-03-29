import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DataProvider } from "./Context/DataContext";
import { AxiosInterceptor } from "./Api/Axios";
import useToken from "./Hook/UseToken";
import Login from "./Login/Login";
import RoutesPage from "./Routes";
import { SidebarProvider } from "./Context/SidebarDataContext";

function App() {
    const { token } = useToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            return navigate("/login", { replace: true });
        }
    }, []);

    return (
        <>
            {token ? (
                <SidebarProvider>
                    <DataProvider>
                        <AxiosInterceptor>
                            <RoutesPage />
                        </AxiosInterceptor>
                    </DataProvider>
                </SidebarProvider>
            ) : null}
            {token ? null : (
                <Routes>
                    <Route path="/login" element={<Login />} />
                </Routes>
            )}
        </>
    );
}

export default App;
