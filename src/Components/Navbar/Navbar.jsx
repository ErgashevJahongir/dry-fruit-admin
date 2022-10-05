import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Layout,
    List,
    Menu,
    Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
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
    CloseOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../../Hook/UseData";
import useToken from "../../Hook/UseToken";
import DrapdownMenu from "../DrapdownMenu/DrapdownMenu";
import "./Navbar.css";
import instance from "../../Api/Axios";

const { Header } = Layout;

function Navbar() {
    const [isVisible, setIsVisible] = useState(false);
    const [notificationn, setNotificationn] = useState([]);
    const { user } = useData();
    const { token } = useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const getNotification = () => {
        instance
            .get(`api/dry/fruit/notification/get`)
            .then((data) => {
                setNotificationn(data.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getNotification();
    }, []);

    const handleLogOut = (e) => {
        e.preventDefault();
        if (sessionStorage.getItem("dry-fruit"))
            sessionStorage.removeItem("dry-fruit", token);
        if (localStorage.getItem("dry-fruit")) {
            localStorage.removeItem("dry-fruit", token);
        }
        navigate("/login", { replace: true });
        window.location.href = "/";
    };

    const showDrawer = () => {
        setIsVisible(true);
    };

    const onClose = () => {
        setIsVisible(false);
    };

    const menuBell = (
        <List
            min-width="100%"
            className="header-notifications-dropdown "
            itemLayout="horizontal"
            dataSource={notificationn}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        title={item.title}
                        description={item.text}
                        avatar={
                            <Tooltip title="Yopish">
                                <Button
                                    shape="circle"
                                    icon={<CloseOutlined />}
                                    onClick={() => {
                                        instance
                                            .put(
                                                `api/dry/fruit/notification/update?id=${item.id}`
                                            )
                                            .then((data) => getNotification())
                                            .catch((err) => console.error(err));
                                    }}
                                />
                            </Tooltip>
                        }
                    ></List.Item.Meta>
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
                    style={{ width: "70%" }}
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
                <span className="user" style={{ marginLeft: "auto" }}>
                    {user?.roleId !== 3 ? (
                        <Badge
                            size="small"
                            count={notificationn?.length}
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
                    ) : null}
                    <Dropdown
                        className="inline-navber"
                        overlay={menu}
                        placement="bottomRight"
                        arrow
                    >
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
