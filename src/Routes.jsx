import { Route, Routes } from "react-router-dom";
import Clients from "./Clients/Clients";
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
import BlockPage from "./Module/ErrorPages/BlockPage";
import { useData } from "./Hook/UseData";
import Country from "./Others/Country/Country";
import DryFruitLimit from "./Others/DryFruitLimit/DryFruitLimit";
import Outlay from "./Others/Outlay/Outlay";
import IncomeInProsses from "./Others/IncomeInProsses/IncomeInProsses";
import OutcomeScanner from "./OutcomeScanner/OutcomeScanner";
import OutcomeNakladnoy from "./OutcomeNakladnoy/OutcomeNakladnoy";
import Nakladnoy from "./Nakladnoy/Nakladnoy";

const RoutesPage = () => {
    const { user, userLoading } = useData();

    if (user && userLoading) {
        return <Loading />;
    }

    return (
        <>
            {user?.block ? (
                <Routes>
                    <Route path="/" element={<BlockPage />} />
                </Routes>
            ) : (
                <Routes>
                    <Route element={<LayoutMenu />}>
                        <Route index element={<Dashboard />} />
                        <Route path="home" element={<Dashboard />} />
                        <Route path="dryfruit" element={<DryFruit />} />
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
                        <Route path="kassa" element={<OutcomeScanner />} />
                        <Route path="indebts" element={<InDebt />} />
                        <Route path="outdebts" element={<OutDebt />} />
                        <Route path="clients" element={<Clients />} />
                        <Route path="profil" element={<Profil />} />
                        <Route path="outlay" element={<Outlay />} />
                        <Route
                            path="outcome-client"
                            element={<OutcomeNakladnoy />}
                        />
                        <Route path="client-salelist" element={<Nakladnoy />} />
                        {user?.roleId === 1 && (
                            <>
                                <Route path="branchs" element={<Branch />} />
                                <Route path="country" element={<Country />} />
                                <Route
                                    path="dryfruit-limit"
                                    element={<DryFruitLimit />}
                                />
                                <Route
                                    path="income-in-prosses"
                                    element={<IncomeInProsses />}
                                />
                            </>
                        )}
                        {user?.roleId === 1 || user?.roleId === 2 ? (
                            <>
                                <Route
                                    path="worker-debts"
                                    element={<WorkerDebt />}
                                />
                                <Route path="users" element={<Users />} />
                                <Route path="worker" element={<Worker />} />
                                <Route path="others" element={<Others />} />
                                <Route
                                    path="notification"
                                    element={<Notification />}
                                />
                            </>
                        ) : null}
                    </Route>
                    <Route path="*" element={<Error404 />} />
                    <Route path="error-404" element={<Error404 />} />
                    <Route path="server-error" element={<Error500 />} />
                    <Route path="login" element={<Login />} />
                </Routes>
            )}
        </>
    );
};

export default RoutesPage;
