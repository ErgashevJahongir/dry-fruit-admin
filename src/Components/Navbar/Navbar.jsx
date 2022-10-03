import { Avatar, Badge, Dropdown, Layout, List, Menu } from "antd";
import React, { useState } from "react";
import {
    DashboardOutlined,
    MenuOutlined,
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
    BellFilled,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../Hook/UseData";
import useToken from "../../Hook/UseToken";
import DrapdownMenu from "../DrapdownMenu/DrapdownMenu";
import "./Navbar.css";

const { Header } = Layout;

function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const { user } = useData();
    const { token } = useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogOut = (e) => {
        e.preventDefault();
        if (sessionStorage.getItem("dry-fruit"))
            sessionStorage.removeItem("dry-fruit", token);
        if (localStorage.getItem("dry-fruit")) {
            localStorage.removeItem("dry-fruit", token);
        }
        navigate("/login", { replace: true });
    };

    const showDrawer = () => {
        setIsVisible(true);
    };

    const onClose = () => {
        setIsVisible(false);
    };

    const data = [
        {
            title: "New message from Sophie",
            description: <>salom 2 days ago</>,
        },
        {
            title: "New album by Travis Scott",
            description: <>salom 2 days ago</>,
        },
        {
            title: "Payment completed",
            description: <>salom 2 days ago</>,
        },
    ];

    const menuBell = (
        <List
            min-width="100%"
            className="header-notifications-dropdown "
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        title={item.title}
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    );

    const menu = (
        <Menu
            items={[
                {
                    key: "/profil",
                    icon: <UserOutlined />,
                    label: (
                        <Link
                            to="/profil"
                            style={{ width: "100px", display: "inline-block" }}
                        >
                            Profil
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
                    key: "3",
                    danger: true,
                    icon: <LogoutOutlined />,
                    label: (
                        <div
                            onClick={(e) => handleLogOut(e)}
                            style={{ width: "100px" }}
                        >
                            Chiqish
                        </div>
                    ),
                },
            ]}
        />
    );

    return (
        <Header
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 99,
            }}
        >
            <div
                className="container"
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div className="logo" style={{ marginRight: "5%" }}>
                    <Link
                        to="/"
                        style={{ marginTop: "10px", display: "block" }}
                    >
                        <h1
                            style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#ff5722",
                            }}
                        >
                            Dry Fruits
                            <i
                                className="bx bxs-gas-pump"
                                style={{ marginLeft: "10px", fontSize: "26px" }}
                            />
                        </h1>
                    </Link>
                </div>
                <Menu
                    style={{ width: "75%" }}
                    className="inline-navber"
                    theme="dark"
                    defaultSelectedKeys={[location.pathname]}
                    mode="horizontal"
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
                                    <ProfileOutlined
                                        style={{ fontSize: "18px" }}
                                    />
                                </Link>
                            ),
                        },
                        {
                            label: "Sklad",
                            key: "/warehouse-dryfruit",
                            icon: (
                                <Link to="/warehouse-dryfruit">
                                    <CloudOutlined
                                        style={{ fontSize: "18px" }}
                                    />
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
                            label: "Qarzlar",
                            key: "/debts",
                            icon: (
                                <Link to="/debts">
                                    <DollarCircleOutlined
                                        style={{ fontSize: "18px" }}
                                    />
                                </Link>
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
                                                      style={{
                                                          fontSize: "18px",
                                                      }}
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
                                <AppstoreAddOutlined
                                    style={{ fontSize: "18px" }}
                                />
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
                                user?.roleId === 1
                                    ? {
                                          label: "Filiallar",
                                          key: "/branchs",
                                          icon: (
                                              <Link to="/branchs">
                                                  <BranchesOutlined
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
                                          label: "Foydalanuvchilar",
                                          key: "/users",
                                          icon: (
                                              <Link to="/users">
                                                  <UserOutlined
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
                                          label: "Boshqalar",
                                          key: "/others",
                                          icon: (
                                              <Link to="/others">
                                                  <AppstoreOutlined
                                                      style={{
                                                          fontSize: "18px",
                                                      }}
                                                  />
                                              </Link>
                                          ),
                                      }
                                    : null,
                            ],
                        },
                    ]}
                />
                <span
                    className="user inline-navber"
                    style={{ marginLeft: "auto" }}
                >
                    <Badge
                        size="small"
                        count={4}
                        style={{ marginRight: "15px" }}
                    >
                        <Dropdown overlay={menuBell} trigger={["click"]}>
                            <a
                                href="#pablo"
                                className="ant-dropdown-link"
                                onClick={(e) => e.preventDefault()}
                            >
                                <BellFilled
                                    style={{
                                        fontSize: "18px",
                                        color: "#08c",
                                        marginRight: "15px",
                                    }}
                                />
                            </a>
                        </Dropdown>
                    </Badge>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                        <Avatar
                            size="large"
                            style={{
                                color: "#f56a00",
                                backgroundColor: "#fde3cf",
                            }}
                        >
                            {user?.fio?.charAt(0)}
                        </Avatar>
                    </Dropdown>
                </span>
                <div className="burger-menu">
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MenuOutlined
                            onClick={showDrawer}
                            rotate={180}
                            style={{ fontSize: "28px", color: "#fff" }}
                        />
                        <DrapdownMenu onClose={onClose} isVisible={isVisible} />
                    </span>
                </div>
            </div>
        </Header>
    );
}

export default Navbar;
