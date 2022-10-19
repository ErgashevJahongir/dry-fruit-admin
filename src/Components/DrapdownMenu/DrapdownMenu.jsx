import { Drawer, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
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
    BellOutlined,
    CarOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import useToken from "../../Hook/UseToken";
import { useData } from "../../Hook/UseData";

function DrapdownMenu({ onClose, isVisible }) {
    const { token } = useToken();
    const { user } = useData();
    const location = useLocation();

    const handleLogOut = (e) => {
        e.preventDefault();
        if (sessionStorage.getItem("dry-fruit"))
            sessionStorage.removeItem("dry-fruit", token);
        if (localStorage.getItem("dry-fruit")) {
            localStorage.removeItem("dry-fruit", token);
        }
        window.location.href = "/login";
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
                    height: "125vh",
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
                                <CloudDownloadOutlined
                                    style={{ fontSize: "18px" }}
                                />
                            </Link>
                        ),
                    },
                    {
                        label: "Sotilgan Mahsulotlar",
                        key: "/outcome",
                        icon: (
                            <CloudUploadOutlined style={{ fontSize: "18px" }} />
                        ),
                        children: [
                            {
                                label: "Sotilgan Mahsulotlar",
                                key: "/outcome-dryfruit",
                                icon: (
                                    <Link to="/outcome-dryfruit">
                                        <CloudUploadOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            {
                                label: "Kassada Sotish",
                                key: "/kassa",
                                icon: (
                                    <Link to="/kassa">
                                        <CloudUploadOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                        ],
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
                                label: "Qarzga olingan mahsulotlar",
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
                                label: "Klientlar qarzlari",
                                key: "/outdebts",
                                icon: (
                                    <Link to="/outdebts">
                                        <DollarCircleOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
                            user?.roleId === 1 || user?.roleId === 2
                                ? {
                                      label: "Ishchilar qarzlari",
                                      key: "/worker-debts",
                                      icon: (
                                          <Link to="/worker-debts">
                                              <DollarCircleOutlined
                                                  style={{ fontSize: "18px" }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
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
                                label: "Chiqimlar",
                                key: "/outlay",
                                icon: (
                                    <Link to="/outlay">
                                        <DollarCircleOutlined
                                            style={{ fontSize: "18px" }}
                                        />
                                    </Link>
                                ),
                            },
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
                            user?.roleId === 1
                                ? {
                                      label: "Kelayotgan quruq mevalar",
                                      key: "/income-in-prosses",
                                      icon: (
                                          <Link to="/income-in-prosses">
                                              <CloudUploadOutlined
                                                  style={{
                                                      fontSize: "18px",
                                                  }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1
                                ? {
                                      label: "Yuk keluvchi davlatlar",
                                      key: "/country",
                                      icon: (
                                          <Link to="/country">
                                              <CarOutlined
                                                  style={{
                                                      fontSize: "18px",
                                                  }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1
                                ? {
                                      label: "Quruq meva limiti",
                                      key: "/dryfruit-limit",
                                      icon: (
                                          <Link to="/dryfruit-limit">
                                              <FileTextOutlined
                                                  style={{
                                                      fontSize: "18px",
                                                  }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1 || user?.roleId === 2
                                ? {
                                      label: "Ishchilar",
                                      key: "/worker",
                                      icon: (
                                          <Link to="/worker">
                                              <TeamOutlined
                                                  style={{ fontSize: "18px" }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1 || user?.roleId === 2
                                ? {
                                      label: "Foydalanuvchilar",
                                      key: "/users",
                                      icon: (
                                          <Link to="/users">
                                              <UserOutlined
                                                  style={{ fontSize: "18px" }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1
                                ? {
                                      label: "Filiallar",
                                      key: "/branchs",
                                      icon: (
                                          <Link to="/branchs">
                                              <BranchesOutlined
                                                  style={{ fontSize: "18px" }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
                            user?.roleId === 1 || user?.roleId === 2
                                ? {
                                      label: "Boshqalar",
                                      key: "/others",
                                      icon: (
                                          <Link to="/others">
                                              <AppstoreOutlined
                                                  style={{ fontSize: "18px" }}
                                              />
                                          </Link>
                                      ),
                                  }
                                : null,
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
                    user?.roleId === 1 || user?.roleId === 2
                        ? {
                              key: "/notification",
                              icon: <BellOutlined />,
                              label: (
                                  <Link
                                      to="/notification"
                                      style={{
                                          width: "100px",
                                          display: "inline-block",
                                      }}
                                  >
                                      Eslatmalar
                                  </Link>
                              ),
                          }
                        : null,
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
