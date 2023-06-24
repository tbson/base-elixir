import * as React from "react";
import { useState } from "react";
import { useNavigate, useLocation, useParams, Outlet } from "react-router-dom";
import { t } from "ttag";
import { Layout, Menu, Row, Col, Popover } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    ApartmentOutlined,
    ClusterOutlined,
    SmileOutlined,
    AuditOutlined,
    DollarOutlined,
    LeftOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { LOGO_TEXT, DOMAIN } from "src/consts";
import StorageUtil from "util/storage_util";
import PemUtil from "util/pem_util";
import NavUtil from "util/nav_util";
// import LocaleSelect from "component/common/locale_select.jsx";
import styles from "./styles.module.css";
const { Header, Footer, Sider, Content } = Layout;

/**
 * MainLayout.
 */
export default function MainLayout() {
    const { id: companyId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);
    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const logout = NavUtil.logout(navigate);
    const navigateTo = NavUtil.navigateTo(navigate);

    const auth = StorageUtil.getStorageObj("auth");

    /**
     * processSelectedKey.
     *
     * @param {string} pathname
     * @returns {string}
     */
    function processSelectedKey(pathname) {
        if (pathname.startsWith("/staff")) return "/staff";
        return pathname;
    }

    function getMenuItems() {
        const result = [];

        result.push({
            label: t`Back`,
            key: "/app/org/company",
            icon: <LeftOutlined />
        });
        const profileType = parseInt(auth.profile_type || "0");

        if (
            (PemUtil.canView("Position") || PemUtil.canView("Employee")) &&
            StorageUtil.isAdminSide(profileType)
        ) {
            const orgGroup = {
                label: t`Company`,
                key: "company",
                icon: <ClusterOutlined />,
                children: []
            };
            if (PemUtil.canView("Company")) {
                orgGroup.children.push({
                    label: t`Information`,
                    key: `/app/work/${companyId}/org/company`,
                    icon: <InfoCircleOutlined />
                });
            }
            if (PemUtil.canView("Position")) {
                orgGroup.children.push({
                    label: t`Position`,
                    key: `/app/work/${companyId}/org/position`,
                    icon: <ApartmentOutlined />
                });
            }
            if (PemUtil.canView("Employee")) {
                orgGroup.children.push({
                    label: t`Employee`,
                    key: `/app/work/${companyId}/org/employee`,
                    icon: <SmileOutlined />
                });
            }
            if (PemUtil.canView("SalaryPolicy")) {
                orgGroup.children.push({
                    label: t`Salary policy`,
                    key: `/app/work/${companyId}/document/salary-policy`,
                    icon: <AuditOutlined />
                });
            }
            if (PemUtil.canView("SalaryRecord")) {
                orgGroup.children.push({
                    label: t`Salary record`,
                    key: `/app/work/${companyId}/document/salary-record`,
                    icon: <DollarOutlined />
                });
            }
            result.push(orgGroup);
        }
        return result;
    }

    function handleTopMenuClick(key) {
        if (key === "logout") {
            logout();
            return;
        }
        navigateTo(key);
    }

    function getTopMenuItems() {
        return [
            {
                label: t`Profile`,
                key: "/app/profile",
                icon: <UserOutlined />
            },
            {
                label: t`Logout`,
                key: "logout",
                icon: <LogoutOutlined />
            }
        ];
    }

    const topMenu = (
        <Menu
            theme="light"
            mode="vertical"
            items={getTopMenuItems()}
            onClick={({ key }) => handleTopMenuClick(key)}
        />
    );

    return (
        <Layout className={styles.wrapperContainer}>
            <Sider
                theme="light"
                trigger={null}
                breakpoint="lg"
                collapsedWidth="80"
                collapsible
                collapsed={collapsed}
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }}
            >
                <div className="logo">{collapsed || LOGO_TEXT}</div>
                <Menu
                    className="sidebar-nav"
                    defaultOpenKeys={["company"]}
                    defaultSelectedKeys={[processSelectedKey(location.pathname)]}
                    theme="light"
                    mode="inline"
                    items={getMenuItems()}
                    onClick={({ key }) => navigateTo(key)}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-header" style={{ padding: 0 }}>
                    <Row>
                        <Col span={12}>
                            {React.createElement(
                                collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                                {
                                    className: "trigger",
                                    onClick: toggle
                                }
                            )}
                        </Col>
                        <Col span={12} className="right" style={{ paddingRight: 20 }}>
                            {/*
                            <LocaleSelect />
                            */}
                            <Popover
                                placement="bottom"
                                content={topMenu}
                                trigger="click"
                            >
                                <span
                                    onKeyDown={() => {}}
                                    onKeyUp={() => {}}
                                    onKeyPress={() => {}}
                                    className="pointer"
                                    role="button"
                                    tabIndex="0"
                                >
                                    <span>
                                        {StorageUtil.getStorageObj("auth").name}
                                    </span>
                                    &nbsp;&nbsp;
                                    <DownOutlined />
                                </span>
                            </Popover>
                        </Col>
                    </Row>
                </Header>
                <Content className="site-layout-content">
                    <Outlet />
                </Content>
                <Footer className="layout-footer">Copyright {DOMAIN} 2022</Footer>
            </Layout>
        </Layout>
    );
}
