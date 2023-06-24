import * as React from "react";
import { useEffect, useState } from "react";
import { Divider, Button, Row, Col } from "antd";
import { t } from "ttag";
import { UserOutlined } from "@ant-design/icons";
import PageHeading from "component/common/page_heading";
import Img from "component/common/img";
import RequestUtil from "util/request_util";
import EventUtil from "util/event_util";
import { urls, messages } from "../config";
import UpdateProfile from "./update";

export default function AssistantProfile() {
    const [data, setData] = useState({ user: {} });
    useEffect(() => {
        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(urls.profile)
            .then((data) => {
                setData(data);
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    }, []);
    return (
        <div>
            <PageHeading>{messages.heading}</PageHeading>
            <div className="content">
                <Row gutter={[10, 10]}>
                    <Col span={2}>
                        <Img src={data.avatar} />
                    </Col>
                    <Col span={22}>
                        <Row gutter={[5, 5]}>
                            <Col span={6}>
                                <strong>{t`Fullname`}</strong>
                            </Col>
                            <Col span={18}>{data.name}</Col>

                            <Col span={6}>
                                <strong>{t`Email`}</strong>
                            </Col>
                            <Col span={18}>{data.user.email}</Col>

                            <Col span={6}>
                                <strong>{t`Phone number`}</strong>
                            </Col>
                            <Col span={18}>{data.user.mobile}</Col>
                        </Row>
                    </Col>
                </Row>

                <Divider />
                <Button
                    htmlType="button"
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={() => UpdateProfile.toggle(true, data)}
                >
                    {t`Update profile`}
                </Button>
                <UpdateProfile onChange={(updateData) => setData(updateData)} />
            </div>
        </div>
    );
}

AssistantProfile.displayName = "AssistantProfile";
