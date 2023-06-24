import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Table } from "antd";
import { useSetRecoilState } from "recoil";
import Pagination, { defaultLinks } from "component/common/table/pagination";
import SearchInput from "component/common/table/search_input";
import {
    AddNewBtn,
    RemoveSelectedBtn,
    EditBtn,
    RemoveBtn
} from "component/common/table/button";
import { BoolDisplay, NumberDisplay, DateDisplay } from "component/common/display";
import PemCheck from "component/common/pem_check";
import DateUtil from "util/date_util";
import OptionUtil from "util/option_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { insuranceRecordOptionSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "InsuranceRecord";

export default function InsuranceRecordTable({ date }) {
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

    const setInsuranceRecordOption = useSetRecoilState(insuranceRecordOptionSt);

    function getQueryParams() {
        const params = {};
        if (searchParam) {
            params.search = searchParam;
        }

        return { ...params, ...cursorParam, ...filterParams, ...sortParams };
    }
    function getList() {
        const params = getQueryParams();
        params.date = DateUtil.dateToStr(date);
        if (companyId) {
            params.company_id = companyId;
        }
        setLoading(true);
        return RequestUtil.apiCall(urls.crud, params)
            .then((data) => {
                setLinks(data.links);
                setList(EnumUtil.ensureReactKey(data.items));
                setInsuranceRecordOption(OptionUtil.getAllOptions(data.extra.option));
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
    }, [searchParam, cursorParam, filterParams, date]);

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
        RequestUtil.apiCall(`${urls.crud}?ids=${ids.join(",")}`, params, "delete")
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
            key: "date",
            title: labels.date,
            dataIndex: "date",
            width: 150,
            render: (value) => <DateDisplay value={value} type="month" />
        },
        {
            title: t`Employee informaton`,
            children: [
                {
                    key: "uid",
                    title: labels.uid,
                    dataIndex: ["employee", "uid"],
                    width: 150,
                    sorter: true
                },
                {
                    key: "name",
                    title: labels.name,
                    width: 150,
                    dataIndex: ["employee", "name"]
                },
                {
                    key: "email",
                    title: labels.email,
                    width: 150,
                    dataIndex: ["employee", "email"]
                },
                {
                    key: "phone_number",
                    title: labels.phone_number,
                    width: 150,
                    dataIndex: ["employee", "phone_number"]
                },
                {
                    key: "title",
                    title: labels.title,
                    width: 150,
                    dataIndex: ["employee", "title"]
                },
                {
                    key: "department",
                    title: labels.department,
                    width: 150,
                    dataIndex: ["employee", "department"]
                }
            ]
        },
        {
            key: "applied_salary",
            title: labels.applied_salary,
            dataIndex: "applied_salary",
            width: 150,
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "applied_benefit",
            title: labels.applied_benefit,
            dataIndex: "applied_benefit",
            width: 150,
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "is_social_insurance_target",
            title: labels.is_social_insurance_target,
            dataIndex: "is_social_insurance_target",
            width: 150,
            render: (value) => <BoolDisplay value={value} />
        },

        {
            title: t`Employee responsibility`,
            children: [
                {
                    key: "employee_retirement_fund",
                    title: labels.employee_retirement_fund,
                    dataIndex: "employee_retirement_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "employee_medical_insurance_fund",
                    title: labels.employee_medical_insurance_fund,
                    dataIndex: "employee_medical_insurance_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "employee_voluntary_insurance_fund",
                    title: labels.employee_voluntary_insurance_fund,
                    dataIndex: "employee_voluntary_insurance_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "employee_paid_amount",
                    title: labels.employee_paid_amount,
                    dataIndex: "employee_paid_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                }
            ]
        },
        {
            title: t`Company responsibility`,
            children: [
                {
                    key: "company_retirement_fund",
                    title: labels.company_retirement_fund,
                    dataIndex: "company_retirement_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_sickness_maternity_fund",
                    title: labels.company_sickness_maternity_fund,
                    dataIndex: "company_sickness_maternity_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_accident_occupational_disease_fund",
                    title: labels.company_accident_occupational_disease_fund,
                    dataIndex: "company_accident_occupational_disease_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_medical_insurance_fund",
                    title: labels.company_medical_insurance_fund,
                    dataIndex: "company_medical_insurance_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_voluntary_insurance_fund",
                    title: labels.company_voluntary_insurance_fund,
                    dataIndex: "company_voluntary_insurance_fund",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_paid_amount",
                    title: labels.company_paid_amount,
                    dataIndex: "company_paid_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "union_fee",
                    title: labels.union_fee,
                    dataIndex: "union_fee",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_total_paid_amount",
                    title: labels.company_total_paid_amount,
                    dataIndex: "company_total_paid_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "company_total_paid_amount_with_union_fee",
                    title: labels.company_total_paid_amount_with_union_fee,
                    dataIndex: "company_total_paid_amount_with_union_fee",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                }
            ]
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

    return (
        <div>
            <SearchInput onChange={searchList} />
            <Table
                bordered
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
        </div>
    );
}

InsuranceRecordTable.displayName = "InsuranceRecordTable";
