import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Clients from "./Clients/Clients";
import useToken from "./Hook/UseToken";
import LayoutMenu from "./Components/Layout/Layout";
import Dashboard from "./Dashboard/Dashboard";
import WorkerDebt from "./Debt/WorkerDebt";
import DryFruit from "./DryFruit/DryFruit";
import IncomeDryFruit from "./IncomeDryFruit/IncomeDryFruit";
import Login from "./Login/Login";
import Error404 from "./Module/ErrorPages/Error404";
import Error500 from "./Module/ErrorPages/Error500";
import Profil from "./Profil/Profil";
import Users from "./Others/Users/Users";
import Worker from "./Others/Worker/Worker";
import OutcomeDryFruit from "./OutcomeDryFruit/OutcomeDryFruit";
import WarehouseDryfruit from "./WarehouseDryfruit/WarehouseDryfruit";
import Others from "./Others/Others/Others";
import Branch from "./Others/BranchVsRole/Branch";
import InDebt from "./Debt/InDebt";
import OutDebt from "./Debt/OutDebt";
import Notification from "./Components/Notification/Notification";
import Loading from "./Components/Loading";
import { DataProvider } from "./Context/DataContext";
import { AxiosInterceptor } from "./Api/Axios";
import axios from "axios";
import BlockPage from "./Module/ErrorPages/BlockPage";

function App() {
    const { token } = useToken();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    const getUserData = () => {
        axios
            .get(
                "https://app-dry-fruits.herokuapp.com/api/dry/fruit/api/dry/fruit/user",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then((data) => {
                setUser(data.data.data);
                setTimeout(() => {
                    setUserLoading(false);
                }, 2000);
            })
            .catch((err) => {
                setUserLoading(false);
                console.error(err);
                navigate("/login");
            });
    };

    useEffect(() => {
        getUserData();
        if (!token) {
            return navigate("/login", { replace: true });
        }
    }, []);

    if (userLoading && user) {
        return <Loading />;
    }

    return (
        <>
            {token ? (
                <DataProvider>
                    <AxiosInterceptor>
                        {user?.block ? (
                            <Routes>
                                <Route path="/" element={<BlockPage />} />
                            </Routes>
                        ) : (
                            <Routes>
                                <Route element={<LayoutMenu />}>
                                    <Route index element={<Dashboard />} />
                                    <Route
                                        path="home"
                                        element={<Dashboard />}
                                    />
                                    <Route
                                        path="dryfruit"
                                        element={<DryFruit />}
                                    />
                                    <Route
                                        path="warehouse-dryfruit"
                                        element={<WarehouseDryfruit />}
                                    />
                                    <Route
                                        path="income-dryfruit"
                                        element={<IncomeDryFruit />}
                                    />
                                    <Route
                                        path="outcome-dryfruit"
                                        element={<OutcomeDryFruit />}
                                    />
                                    <Route
                                        path="indebts"
                                        element={<InDebt />}
                                    />
                                    <Route
                                        path="outdebts"
                                        element={<OutDebt />}
                                    />
                                    <Route
                                        path="clients"
                                        element={<Clients />}
                                    />
                                    <Route path="profil" element={<Profil />} />
                                    {user?.roleId === 1 && (
                                        <Route
                                            path="branchs"
                                            element={<Branch />}
                                        />
                                    )}
                                    {user?.roleId === 1 ||
                                    user?.roleId === 2 ? (
                                        <>
                                            <Route
                                                path="worker-debts"
                                                element={<WorkerDebt />}
                                            />
                                            <Route
                                                path="users"
                                                element={<Users />}
                                            />
                                            <Route
                                                path="worker"
                                                element={<Worker />}
                                            />
                                            <Route
                                                path="others"
                                                element={<Others />}
                                            />
                                            <Route
                                                path="notification"
                                                element={<Notification />}
                                            />
                                        </>
                                    ) : null}
                                </Route>
                                <Route path="*" element={<Error404 />} />
                                <Route
                                    path="error-404"
                                    element={<Error404 />}
                                />
                                <Route
                                    path="server-error"
                                    element={<Error500 />}
                                />
                                <Route path="login" element={<Login />} />
                            </Routes>
                        )}
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
