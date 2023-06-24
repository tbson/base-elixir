import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Table, Upload, Button, Skeleton, Alert, notification } from "antd";
import { FileExcelFilled } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import Pagination, { defaultLinks } from "component/common/table/pagination";
import SearchInput from "component/common/table/search_input";
import {
    AddNewBtn,
    RemoveSelectedBtn,
    EditBtn,
    RemoveBtn
} from "component/common/table/button";
import PemCheck from "component/common/pem_check";
import OptionUtil from "util/option_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil, { REQUEST_STATUS } from "util/request_util";
import Dialog from "./dialog";
import { employeeOptionSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "Employee";

export default function EmployeeTable() {
    const { id: companyIdRaw } = useParams();
    const companyId = parseInt(companyIdRaw);
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);
    const [searchParam, setSearchParam] = useState("");
    const [cursorParam, setCursorParam] = useState({});
    const [filterParams, setFilterParams] = useState({});
    const [sortParams, setSortParams] = useState({});
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.WAITING);
    const [errMsg, setErrMsg] = useState("");

    const [employeeOption, setEmployeeOption] = useRecoilState(employeeOptionSt);

    function getQueryParams() {
        const params = {};
        if (searchParam) {
            params.search = searchParam;
        }

        return { ...params, ...cursorParam, ...filterParams, ...sortParams };
    }
    function getList() {
        const params = getQueryParams();
        if (companyId) {
            params.company_id = companyId;
        }
        setLoading(true);
        return RequestUtil.apiCall(urls.crud, params)
            .then((data) => {
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setLinks(data.links);
                setList(EnumUtil.ensureReactKey(data.items));
                setEmployeeOption(OptionUtil.getAllOptions(data.extra.option));
            })
            .catch((err) => {
                setRequestStatus(REQUEST_STATUS.ERROR);
                setErrMsg(err.detail[0]);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function searchList(search) {
        setSearchParam(search);
    }

    useEffect(() => {
        getList();
    }, [searchParam, cursorParam, filterParams]);

    function onDelete(id) {
        const r = window.confirm(messages.deleteOne);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        const params = companyId ? { company_id: companyId } : {};
        RequestUtil.apiCall(`${urls.crud}${id}`, params, "delete")
            .then(() => {
                setList([...list.filter((item) => item.id !== id)]);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    }

    function onBulkDelete(ids) {
        const r = window.confirm(messages.deleteMultiple);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        const params = companyId ? { company_id: companyId } : {};
        RequestUtil.apiCall(urls.crud, { ...params, ids: ids.join(",") }, "delete")
            .then(() => {
                setList([...list.filter((item) => !ids.includes(item.id))]);
                setIds([]);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    }

    function onChange(data, id) {
        if (!id) {
            setList([{ ...data, key: data.id }, ...list]);
        } else {
            const index = list.findIndex((item) => item.id === id);
            data.key = data.id;
            list[index] = data;
            setList([...list]);
        }
    }
    const columns = [
        {
            key: "uid",
            title: labels.uid,
            dataIndex: "uid",
            width: 150,
            sorter: true
        },
        /*
        {
            key: "position_id",
            title: labels.position_id,
            dataIndex: "position_id",
            width: 120,
            filterMultiple: false,
            defaultFilteredValue: [],
            filters: employeeOption.position.filterOptions,
            render: (value) => employeeOption.position.mapOptions[value]
        },
        */
        {
            key: "full_name",
            title: labels.full_name,
            dataIndex: "full_name"
        },
        {
            key: "gender",
            title: labels.gender,
            dataIndex: "gender",
            width: 120,
            filterMultiple: false,
            defaultFilteredValue: [],
            filters: employeeOption.gender.filterOptions,
            render: (_value, obj) => obj.gender_label
        },
        {
            key: "email",
            title: labels.email,
            dataIndex: "email",
            sorter: true
        },
        {
            key: "phone_number",
            title: labels.phone_number,
            dataIndex: "phone_number",
            sorter: true
        },
        {
            key: "contract_type",
            title: labels.contract_type,
            dataIndex: "contract_type",
            sorter: true,
            filterMultiple: false,
            defaultFilteredValue: [],
            filters: employeeOption.contractType.filterOptions,
            render: (_value, obj) => obj.contract_type_label
        },
        {
            key: "labour_status",
            title: labels.labour_status,
            dataIndex: "labour_status",
            sorter: true,
            filterMultiple: false,
            defaultFilteredValue: [],
            filters: employeeOption.labourStatus.filterOptions,
            render: (_value, obj) => obj.labour_status_label
        },
        {
            key: "education_level",
            title: labels.education_level,
            dataIndex: "education_level",
            sorter: true,
            filterMultiple: false,
            defaultFilteredValue: [],
            filters: employeeOption.educationLevel.filterOptions,
            render: (_value, obj) => obj.education_level_label
        },
        {
            key: "action",
            title: (
                <PemCheck pem_group={PEM_GROUP} pem="create">
                    <AddNewBtn onClick={() => Dialog.toggle()} />
                </PemCheck>
            ),
            fixed: "right",
            width: 90,
            render: (_text, record) => (
                <div className="flex-space">
                    <PemCheck pem_group={PEM_GROUP} pem="update">
                        <EditBtn onClick={() => Dialog.toggle(true, record.id)} />
                    </PemCheck>
                    <PemCheck pem_group={PEM_GROUP} pem="delete">
                        <RemoveBtn onClick={() => onDelete(record.id)} />
                    </PemCheck>
                </div>
            )
        }
    ];

    const rowSelection = {
        onChange: (ids) => {
            setIds(ids);
        }
    };

    const uploadProps = {
        showUploadList: false,
        name: "file",
        beforeUpload: (file) => {
            const params = { file };
            if (companyId) params.company_id = companyId;
            EventUtil.toggleGlobalLoading();
            RequestUtil.apiCall(urls.upload, params, "post")
                .then(() => getList())
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
                    </Upload>{" "}
                    <a
                        href="/public/sample_data/02.employee.xlsx"
                        target="_blank"
                    >{t`Sample file`}</a>
                </div>
                <SearchInput onChange={searchList} />
                <Table
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection
                    }}
                    columns={columns}
                    dataSource={list}
                    loading={loading}
                    // scroll={{ x: 1000 }}
                    pagination={false}
                    scroll={{
                        x: 500 + columns.length * 120,
                        y: "calc(100vh - 0px)"
                    }}
                    onChange={(_pagination, filters, sorter) => {
                        const filterParams = Object.entries(filters).reduce(
                            (acc, [k, v]) => {
                                if (v) {
                                    acc[k] = v[0];
                                }
                                return acc;
                            },
                            {}
                        );
                        setFilterParams(filterParams);

                        if (sorter.column) {
                            const sign = sorter.order === "descend" ? "-" : "";
                            const order = sign + sorter.field;
                            setSortParams({ order });
                        } else {
                            setSortParams({});
                        }

                        setCursorParam({});
                    }}
                />
                <Row>
                    <Col span={12}>
                        <PemCheck pem_group={PEM_GROUP} pem="delete">
                            <RemoveSelectedBtn ids={ids} onClick={onBulkDelete} />
                        </PemCheck>
                    </Col>
                    <Col span={12}>
                        <Pagination
                            next={links.next}
                            prev={links.prev}
                            onChange={(dir) => {
                                setCursorParam({ [dir]: links[dir] });
                            }}
                        />
                    </Col>
                </Row>

                <Dialog onChange={onChange} />
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

    return <div className="content">{getContent()}</div>;
}

EmployeeTable.displayName = "EmployeeTable";
