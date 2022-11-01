import { Layout, BackTop } from "antd";
import Sider from "antd/lib/layout/Sider";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../../Hook/UseSidebar";
import DataInfinitiScroll from "../../OutcomeNakladnoy/DataInfinitiScroll";
import OutcomeScannerDataInfinitiScroll from "../../OutcomeScanner/OutcomeScannerDataInfinitiScroll";
import Navbar from "../Navbar/Navbar";

const { Content } = Layout;

function LayoutMenu() {
    const { nakladnoySidebar, kassaSidebar } = useSidebar();

    const props = kassaSidebar || nakladnoySidebar ? { hasSider: true } : {};

    return (
        <Layout>
            <Navbar />
            <Layout {...props}>
                {nakladnoySidebar ? (
                    <Sider
                        theme={"light"}
                        width={400}
                        style={{
                            overflow: "auto",
                            height: "90vh",
                            position: "fixed",
                            top: 65,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <DataInfinitiScroll />
                    </Sider>
                ) : null}
                ,
                {kassaSidebar ? (
                    <Sider
                        theme={"light"}
                        width={400}
                        style={{
                            overflow: "auto",
                            height: "90vh",
                            position: "fixed",
                            left: 0,
                            top: 65,
                            bottom: 0,
                        }}
                    >
                        <OutcomeScannerDataInfinitiScroll />
                    </Sider>
                ) : null}
                <Layout
                    className="site-layout"
                    style={{
                        marginLeft: nakladnoySidebar || kassaSidebar ? 400 : 0,
                    }}
                >
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: "12px 8px",
                            minHeight: "calc(100vh - 90px)",
                        }}
                    >
                        <div
                            className={
                                nakladnoySidebar || kassaSidebar
                                    ? "containerContent"
                                    : "container"
                            }
                        >
                            <BackTop />
                            <Outlet />
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default LayoutMenu;
