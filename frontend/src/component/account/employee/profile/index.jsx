import * as React from "react";
import { useEffect, useState } from "react";
import { Divider, Row, Col } from "antd";
import { t } from "ttag";
import PageHeading from "component/common/page_heading";
import Img from "component/common/img";
import RequestUtil from "util/request_util";
import EventUtil from "util/event_util";
import { urls, messages } from "../config";

export default function EmployeeProfile() {
    const [data, setData] = useState({});
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
                            <Col span={18}>{data.email}</Col>

                            <Col span={6}>
                                <strong>{t`Phone number`}</strong>
                            </Col>
                            <Col span={18}>{data.mobile}</Col>

                            <Col span={6}>
                                <strong>{t`Organization name`}</strong>
                            </Col>
                            <Col span={18}>{data.org_name}</Col>

                            <Col span={6}>
                                <strong>{t`Organization ID`}</strong>
                            </Col>
                            <Col span={18}>{data.org_uid}</Col>
                        </Row>
                    </Col>
                </Row>

                <Divider />
            </div>
        </div>
    );
}

EmployeeProfile.displayName = "EmployeeProfile";
