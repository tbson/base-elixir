import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { t } from "ttag";
import { Tabs, Upload, Button, Skeleton, Alert, notification } from "antd";
import { FileExcelFilled } from "@ant-design/icons";
import RequestUtil, { REQUEST_STATUS } from "util/request_util";
import DateUtil from "util/date_util";
import EventUtil from "util/event_util";
import PageHeading from "component/common/page_heading";
import SalaryRecordTable from "./table";
import DatePicker from "component/common/form/ant/date_picker";
import TaxRecordTable from "component/document/tax_record/table";
import InsuranceRecordTable from "component/document/insurance_record/table";
import { messages } from "./config";
import { urls } from "./config";

export default function SalaryRecord() {
    const [date, setDate] = useState(DateUtil.get1stDay(DateUtil.getCurrentDate()));
    const [tabKey, setTabKey] = useState(DateUtil.getCurrentTimestamps());
    const { id: companyIdRaw } = useParams();
    const companyId = parseInt(companyIdRaw);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.WAITING);
    const [errMsg, setErrMsg] = useState("");
    const items = [
        {
            key: "1",
            label: t`Salary`,
            children: <SalaryRecordTable date={date} />
        },
        {
            key: "2",
            label: `Tax`,
            children: <TaxRecordTable date={date} />
        },
        {
            key: "3",
            label: `Insurance`,
            children: <InsuranceRecordTable date={date} />
        }
    ];

    function getList() {
        EventUtil.toggleGlobalLoading(true);
        const params = companyId ? { company_id: companyId } : {};
        return RequestUtil.apiCall(urls.crud, params)
            .then((_data) => {
                setRequestStatus(REQUEST_STATUS.SUCCESS);
            })
            .catch((err) => {
                setRequestStatus(REQUEST_STATUS.ERROR);
                setErrMsg(err.detail[0]);
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    }

    useEffect(() => {
        getList();
    }, []);

    const uploadProps = {
        showUploadList: false,
        name: "file",
        beforeUpload: (file) => {
            const params = { file };
            if (companyId) params.company_id = companyId;
            EventUtil.toggleGlobalLoading();
            RequestUtil.apiCall(urls.upload, params, "post")
                .then(() => setTabKey(DateUtil.getCurrentTimestamps()))
                .catch((err) => {
                    notification.error({
                        message: "Error",
                        description: err.detail.map((i) => <div key={i}>{i}</div>),
                        duration: 8
                    });
                })
                .finally(() => EventUtil.toggleGlobalLoading(false));
            return false;
        }
    };

    function getResult() {
        return (
            <>
                <div style={{ marginBottom: 5 }}>
                    <Upload {...uploadProps}>
                        <Button icon={<FileExcelFilled />}>Upload</Button>
                    </Upload>
                    <a
                        href="/public/sample_data/04.salary-tax-insurance.xlsx"
                        target="_blank"
                    >
                        &nbsp;{t`Sample file`}
                    </a>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        picker="month"
                        allowClear={false}
                    />
                </div>
                <Tabs
                    key={tabKey}
                    type="card"
                    defaultActiveKey="1"
                    items={items}
                    destroyInactiveTabPane
                />
            </>
        );
    }

    function getError() {
        return <Alert message={errMsg} type="error" />;
    }

    function getWaiting() {
        return <Skeleton active />;
    }

    function getContent() {
        if (requestStatus === REQUEST_STATUS.SUCCESS) {
            return getResult();
        } else if (requestStatus === REQUEST_STATUS.WAITING) {
            return getWaiting();
        } else {
            return getError();
        }
    }

    return (
        <>
            <PageHeading>
                <>{messages.heading}</>
            </PageHeading>
            <div className="content">{getContent()}</div>
        </>
    );
}

SalaryRecord.displayName = "SalaryRecord";
