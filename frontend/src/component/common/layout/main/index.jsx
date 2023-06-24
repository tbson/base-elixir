import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { t } from "ttag";
import { Layout, Menu, Row, Col, Popover } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    TeamOutlined,
    DownOutlined,
    SettingFilled,
    MessageOutlined,
    ApartmentOutlined,
    ClusterOutlined,
    SmileOutlined,
    AuditOutlined,
    LogoutOutlined,
    FlagOutlined
} from "@ant-design/icons";
import { Socket } from "phoenix";
import { LOGO_TEXT, DOMAIN } from "src/consts";
import StorageUtil from "util/storage_util";
import PemUtil from "util/pem_util";
import NavUtil from "util/nav_util";
import { ChatMessageService } from "component/support/chat_message";
// import LocaleSelect from "component/common/locale_select.jsx";
import styles from "./styles.module.css";
const { Header, Footer, Sider, Content } = Layout;
const socket = new Socket("/api/v1/socket", { params: { token: window.userToken } });
socket.connect();
/**
 * MainLayout.
 */
export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        let companyList = [];
        const auth = StorageUtil.getStorageObj("auth");
        const profileType = parseInt(auth.profile_type || "0");
        if (StorageUtil.isAdminSide(profileType)) {
            companyList = auth.company_list || [];
        } else {
            companyList = [auth.company];
        }
        const companyUids = companyList.map((company) => company.uid);
        const channels = companyUids.map((companyUid) =>
            socket.channel(`room:chat-message:${companyUid}`, {})
        );

        channels.forEach((channel) => {
            channel.join();
            /*
            .receive("ok", (resp) => {
                console.log("Joined successfully", resp);
            })
            .receive("error", (resp) => {
                console.log("Unable to join", resp);
            });
            */
            channel.on("msg", (payload) => {
                // console.log(payload);
                const data = payload.data;
                const companyUid = data.company_uid;
                const activeUid = ChatMessageService.getOpenedChatWindow();
                if (activeUid === companyUid) return;
                // setMessageList((list) => [...list, data]);
            });
        });
        return () => {
            channels.forEach((channel) => {
                channel.leave();
            });
        };
    }, []);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const logout = NavUtil.logout(navigate);
    const navigateTo = NavUtil.navigateTo(navigate);

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

        result.push({ label: t`Profile`, key: "/app/profile", icon: <UserOutlined /> });

        PemUtil.canView("Variable") &&
            result.push({
                label: t`Config`,
                key: "/app/config/variable",
                icon: <SettingFilled />
            });
        /*
        PemUtil.canView("Group") &&
            result.push({
                label: t`Group`,
                key: "/app/role/group",
                icon: <UsergroupAddOutlined />
            });
        */
        PemUtil.canView("Admin") &&
            result.push({
                label: t`Admin`,
                key: "/app/account/admin",
                icon: <TeamOutlined />
            });
        PemUtil.canView("Staff") &&
            result.push({
                label: t`Staff`,
                key: "/app/account/staff",
                icon: <TeamOutlined />
            });
        PemUtil.canView("Company") &&
            result.push({
                label: t`Company`,
                key: "/app/org/company",
                icon: <AuditOutlined />
            });
        /*
        PemUtil.canView("AssigningCompany") &&
            result.push({
                label: t`Assigning company`,
                key: "/app/org/assigning-company",
                icon: <FlagOutlined />
            });
        */
        const auth = StorageUtil.getStorageObj("auth");
        const profileType = parseInt(auth.profile_type || "0");
        if (PemUtil.canView("ChatMessage")) {
            const companyList = auth.company_list || [];
            if (StorageUtil.isAdminSide(profileType)) {
                const chatGroup = {
                    label: t`ChatMessage`,
                    key: "chat-message",
                    icon: <MessageOutlined />,
                    children: companyList.map((company) => ({
                        label: <span>{company.name}</span>,
                        key: `/app/support/chat-message/${company.uid}`,
                        icon: <UserOutlined />
                    }))
                };
                result.push(chatGroup);
            } else {
                result.push({
                    label: t`ChatMessage`,
                    key: `/app/support/chat-message/`,
                    icon: (
                        <span>
                            <UserOutlined />
                        </span>
                    )
                });
            }
        }
        if (
            (PemUtil.canView("Position") || PemUtil.canView("Employee")) &&
            StorageUtil.isCustomerSide(profileType)
        ) {
            const orgGroup = {
                label: t`Company`,
                icon: <ClusterOutlined />,
                children: []
            };
            if (PemUtil.canView("Position")) {
                orgGroup.children.push({
                    label: t`Position`,
                    key: "/app/org/position",
                    icon: <ApartmentOutlined />
                });
            }
            if (PemUtil.canView("Employee")) {
                orgGroup.children.push({
                    label: t`Employee`,
                    key: "/app/org/employee",
                    icon: <SmileOutlined />
                });
            }
            if (PemUtil.canView("SalaryPolicy")) {
                orgGroup.children.push({
                    label: t`Salary policy`,
                    key: "/app/document/salary-policy",
                    icon: <SmileOutlined />
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
            /*
            {
                label: t`Profile`,
                key: "/app/profile",
                icon: <UserOutlined />
            },
            */
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
                    defaultOpenKeys={["chat-message"]}
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
