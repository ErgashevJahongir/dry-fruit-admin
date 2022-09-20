import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Clients from "./Clients/Clients";
import useToken from "./Hook/UseToken";
import { useData } from "./Hook/UseData";
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

function App() {
    const { token } = useToken();
    const navigate = useNavigate();
    const { userLoading } = useData();

    useEffect(() => {
        if (!token) {
            return navigate("/login", { replace: true });
        }
    }, []);

    if (userLoading) {
        return <Loading />;
    }

    return (
        <Routes>
            <Route element={<LayoutMenu />}>
                <Route index element={<Dashboard />} />
                <Route path="home" element={<Dashboard />} />
                <Route path="dryfruit" element={<DryFruit />} />
                <Route
                    path="warehouse-dryfruit"
                    element={<WarehouseDryfruit />}
                />
                <Route path="income-dryfruit" element={<IncomeDryFruit />} />
                <Route path="outcome-dryfruit" element={<OutcomeDryFruit />} />
                <Route path="worker-debts" element={<WorkerDebt />} />
                <Route path="indebts" element={<InDebt />} />
                <Route path="outdebts" element={<OutDebt />} />
                <Route path="clients" element={<Clients />} />
                <Route path="users" element={<Users />} />
                <Route path="worker" element={<Worker />} />
                <Route path="others" element={<Others />} />
                <Route path="branchs" element={<Branch />} />
                <Route path="profil" element={<Profil />} />
                <Route path="notification" element={<Notification />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Error404 />} />
            <Route path="server-error" element={<Error500 />} />
        </Routes>
    );
}

export default App;
