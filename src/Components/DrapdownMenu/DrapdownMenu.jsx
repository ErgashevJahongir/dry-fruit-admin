import { Drawer, Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    CloudUploadOutlined,
    CloudDownloadOutlined,
    CloudOutlined,
    ProfileOutlined,
    DollarCircleOutlined,
    AppstoreAddOutlined,
    TeamOutlined,
    AppstoreOutlined,
    BranchesOutlined,
} from "@ant-design/icons";
import useToken from "../../Hook/UseToken";
// import { useData } from "../../Hook/UseData";

function DrapdownMenu({ onClose, isVisible }) {
    const { token } = useToken();
    const navigate = useNavigate();
    // const { user } = useData();
    const location = useLocation();

    const handleLogOut = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("dry-fruit", token);
        localStorage.removeItem("dry-fruit", token);
        navigate("/login", { replace: true });
    };
    return (
        <Drawer
            placement="right"
            closable={false}
            size="200px"
            onClose={onClose}
            visible={isVisible}
        >
            <Menu
                style={{
                    height: "100%",
                }}
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={["others"]}
                mode="inline"
                theme="dark"
                items={[
                    {
                        label: "Bosh Sahifa",
                        key: "/",
                        icon: (
                            <Link to="/">
                                <DashboardOutlined
                                    style={{ fontSize: "18px" }}
                                />
                            </Link>
                        ),
                    },
                    {
                        label: "Quruq mevalar",
                        key: "/dryfruit",
                        icon: (
                            <Link to="/dryfruit">
                                <ProfileOutlined style={{ fontSize: "18px" }} />
                            </Link>
                        ),
                    },
                    {
                        label: "Sklad",
                        key: "/warehouse-dryfruit",
                        icon: (
                            <Link to="/warehouse-dryfruit">
                                <CloudOutlined style={{ fontSize: "18px" }} />
                            </Link>
                        ),
                    },
                    {
                        label: "Kelgan Mahsulotlar",
                        key: "/income-dryfruit",
                        icon: (
                            <Link to="/income-dryfruit">
                                <CloudUploadOutlined
                                    style={{ fontSize: "18px" }}
                                />
                            </Link>
                        ),
                    },
                    {
                        label: "Sotilgan Mahsulotlar",
                        key: "/outcome-dryfruit",
                        icon: (
                            <Link to="/outcome-dryfruit">
                                <CloudDownloadOutlined
                                    style={{ fontSize: "18px" }}
                                />
                            </Link>
                        ),
                    },
                    {
                        label: "Qarzlar",
                        key: "/debts",
                        icon: (
                            <DollarCircleOutlined
                                style={{ fontSize: "18px" }}
                            />
                        ),
                        children: [
                            {
                                label: "Ichki qarzlar",
                                key: "/indebts",
                                icon: (
                                    <Link to="/indebts">
                                        <DollarCircleOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Tashqi qarzlar",
                                key: "/outdebts",
                                icon: (
                                    <Link to="/outdebts">
                                        <DollarCircleOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Ishchilar qarzlar",
                                key: "/worker-debts",
                                icon: (
                                    <Link to="/worker-debts">
                                        <DollarCircleOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                        ],
                    },
                    {
                        label: "Qo'shimchalar",
                        key: "others",
                        icon: (
                            <AppstoreAddOutlined style={{ fontSize: "18px" }} />
                        ),
                        children: [
                            {
                                label: "Klientlar",
                                key: "/clients",
                                icon: (
                                    <Link to="/clients">
                                        <TeamOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Ishchilar",
                                key: "/worker",
                                icon: (
                                    <Link to="/worker">
                                        <TeamOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Foydalanuvchilar",
                                key: "/users",
                                icon: (
                                    <Link to="/users">
                                        <UserOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Filiallar",
                                key: "/branchs",
                                icon: (
                                    <Link to="/branchs">
                                        <BranchesOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Boshqalar",
                                key: "/others",
                                icon: (
                                    <Link to="/others">
                                        <AppstoreOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                        ],
                    },
                    {
                        label: "Profil",
                        key: "/profil",
                        icon: (
                            <Link to="/profil">
                                <UserOutlined style={{ fontSize: "18px" }} />
                            </Link>
                        ),
                    },
                    {
                        label: "Chiqish",
                        key: "/logout",
                        icon: (
                            <div type="link" onClick={(e) => handleLogOut(e)}>
                                <LogoutOutlined style={{ fontSize: "18px" }} />
                            </div>
                        ),
                    },
                ]}
            />
        </Drawer>
    );
}

export default DrapdownMenu;
