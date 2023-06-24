import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { NavLink } from "react-router-dom";
import { Row, Col, Table, Button, Tooltip, notification } from "antd";
import { CheckOutlined, FlagOutlined } from "@ant-design/icons";
import Pagination, { defaultLinks } from "component/common/table/pagination";
import SearchInput from "component/common/table/search_input";
import {
    AddNewBtn,
    RemoveSelectedBtn,
    EditBtn,
    RemoveBtn,
    ViewBtn
} from "component/common/table/button";
import PemCheck from "component/common/pem_check";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import OptionUtil from "util/option_util";
import RequestUtil from "util/request_util";
import DateUtil from "util/date_util";
import CompanyDialog from "./dialog";
import CompanyAssignDialog from "./assign_dialog";
import { companyOptionSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "Company";
const ACTIVATE_COMPANY_GROUP = "ActivateCompany";

function ActivateBtn({ onClick }) {
    return (
        <Tooltip title={t`Activate`}>
            <Button
                type="default"
                htmlType="button"
                icon={<CheckOutlined />}
                size="small"
                onClick={onClick}
            />
        </Tooltip>
    );
}

function AssignBtn({ onClick }) {
    return (
        <Tooltip title={t`Assign`}>
            <Button
                type="default"
                htmlType="button"
                icon={<FlagOutlined />}
                size="small"
                onClick={onClick}
            />
        </Tooltip>
    );
}

export default function CompanyTable() {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);
    const [searchParam, setSearchParam] = useState("");
    const [cursorParam, setCursorParam] = useState({});
    const [filterParams, setFilterParams] = useState({});
    const [sortParams, setSortParams] = useState({});

    const setCompanyOption = useSetRecoilState(companyOptionSt);

    function getQueryParams() {
        const params = {};
        if (searchParam) {
            params.search = searchParam;
        }

        return { ...params, ...cursorParam, ...filterParams, ...sortParams };
    }

    function getList() {
        const params = getQueryParams();
        setLoading(true);
        return RequestUtil.apiCall(urls.crud, params)
            .then((data) => {
                setLinks(data.links);
                setList(EnumUtil.ensureReactKey(data.items));
                setCompanyOption(OptionUtil.getAllOptions(data.extra.option));
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
        RequestUtil.apiCall(`${urls.crud}${id}`, {}, "delete")
            .then(() => {
                setList([...list.filter((item) => item.id !== id)]);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    }

    function onBulkDelete(ids) {
        const r = window.confirm(messages.deleteMultiple);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(`${urls.crud}?ids=${ids.join(",")}`, {}, "delete")
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
            list[index] = { ...list[index], ...data };
            setList([...list]);
        }
    }

    function activate(id, name) {
        const r = window.confirm(t`Do you want to activate company: ${name}?`);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(`${urls.activate}${id}`, {}, "post")
            .then((data) => {
                onChange({ ...data, id }, id);
            })
            .catch((err) => {
                notification.error({
                    message: "Error",
                    description: err.detail,
                    duration: 8
                });
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    }

    function handleAssign(data, id) {
        console.log(data);
        console.log(id);
    }

    const columns = [
        {
            key: "name",
            title: labels.name,
            dataIndex: "name",
            sorter: true
        },
        {
            key: "name_en",
            title: labels.name_en,
            dataIndex: "name_en",
            sorter: true
        },
        {
            key: "name_short",
            title: labels.name_short,
            dataIndex: "name_short",
            sorter: true
        },
        {
            key: "tax_code",
            title: labels.tax_code,
            dataIndex: "tax_code",
            sorter: true
        },
        {
            key: "insurance_code",
            title: labels.insurance_code,
            dataIndex: "insurance_code",
            sorter: true
        },
        {
            key: "rep_name",
            title: labels.rep_name,
            dataIndex: "rep_name"
        },
        {
            key: "rep_position",
            title: labels.rep_position,
            dataIndex: "rep_position"
        },
        {
            key: "description",
            title: labels.description,
            dataIndex: "description"
        },
        {
            key: "rep_email",
            title: labels.rep_email,
            dataIndex: "rep_email"
        },
        {
            key: "staff",
            title: labels.staff,
            dataIndex: ["staff", "name"]
        },
        {
            key: "activated_at",
            title: labels.activated_at,
            dataIndex: "activated_at",
            render: (text) => (text ? DateUtil.isoToReadableDatetimeStr(text) : "")
        },
        {
            key: "action",
            title: (
                <PemCheck pem_group={PEM_GROUP} pem="create">
                    <AddNewBtn onClick={() => CompanyDialog.toggle()} />
                </PemCheck>
            ),
            fixed: "right",
            width: 90,
            render: (_text, record) => (
                <Row gutter={[5, 7]}>
                    <Col span={12}>
                        <PemCheck pem_group={PEM_GROUP} pem="update">
                            <EditBtn
                                onClick={() => CompanyDialog.toggle(true, record.id)}
                            />
                        </PemCheck>
                    </Col>
                    <Col span={12}>
                        <PemCheck pem_group={PEM_GROUP} pem="delete">
                            <RemoveBtn onClick={() => onDelete(record.id)} />
                        </PemCheck>
                    </Col>
                    <Col span={12}>
                        <PemCheck pem_group={PEM_GROUP} pem="retrieve">
                            <NavLink to={`/app/work/${record.id}/org/company`}>
                                <ViewBtn />
                            </NavLink>
                        </PemCheck>
                    </Col>
                    <Col span={12}>
                        <PemCheck pem_group={ACTIVATE_COMPANY_GROUP} pem="activate">
                            <ActivateBtn
                                onClick={() => activate(record.id, record.name)}
                            />
                        </PemCheck>
                    </Col>
                    <Col span={12}>
                        <PemCheck pem_group={ACTIVATE_COMPANY_GROUP} pem="activate">
                            <AssignBtn
                                onClick={() =>
                                    CompanyAssignDialog.toggle(true, {
                                        company_id: record.id,
                                        staff_id: record?.staff?.id
                                    })
                                }
                            />
                        </PemCheck>
                    </Col>
                </Row>
            )
        }
    ];

    const rowSelection = {
        onChange: (ids) => {
            setIds(ids);
        }
    };

    return (
        <div>
            <SearchInput onChange={searchList} />
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection
                }}
                columns={columns}
                dataSource={list}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={false}
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

            <CompanyDialog onChange={onChange} />
            <CompanyAssignDialog onChange={onChange} />
        </div>
    );
}

CompanyTable.displayName = "CompanyTable";
