import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Loading from "./Components/Loading";
import { DataProvider } from "./Context/DataContext";
import { AxiosInterceptor } from "./Api/Axios";
import useToken from "./Hook/UseToken";
import Login from "./Login/Login";
import RoutesPage from "./RoutesPage";

function App() {
    const { token } = useToken();
    const navigate = useNavigate();
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            return navigate("/login", { replace: true });
        }
        setUserLoading(false);
    }, []);

    if (userLoading) {
        return <Loading />;
    }

    return (
        <>
            {token ? (
                <DataProvider>
                    <AxiosInterceptor>
                        <RoutesPage />
                    </AxiosInterceptor>
                </DataProvider>
            ) : null}
            {token ? null : (
                <Routes>
                    <Route path="login" element={<Login />} />
                </Routes>
            )}
        </>
    );
}

export default App;
