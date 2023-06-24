import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Table } from "antd";
import { useSetRecoilState } from "recoil";
import Pagination, { defaultLinks } from "component/common/table/pagination";
import { NumberDisplay, DateDisplay } from "component/common/display";
import SearchInput from "component/common/table/search_input";
import {
    AddNewBtn,
    RemoveSelectedBtn,
    EditBtn,
    RemoveBtn
} from "component/common/table/button";
import PemCheck from "component/common/pem_check";
import DateUtil from "util/date_util";
import OptionUtil from "util/option_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { salaryRecordOptionSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "SalaryRecord";

export default function SalaryRecordTable({ date }) {
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

    const setSalaryRecordOption = useSetRecoilState(salaryRecordOptionSt);

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
                setSalaryRecordOption(OptionUtil.getAllOptions(data.extra.option));
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
                    width: 200,
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
            title: t`Working days & monthly salary`,
            children: [
                {
                    key: "working_days",
                    title: labels.working_days,
                    dataIndex: "working_days",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "ot_days",
                    title: labels.ot_days,
                    dataIndex: "ot_days",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "base_salary",
                    title: labels.base_salary,
                    dataIndex: "base_salary",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "ot_salary",
                    title: labels.ot_salary,
                    dataIndex: "ot_salary",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                }
            ]
        },
        {
            title: t`Bonus`,
            children: [
                {
                    key: "monthly_performance_bonus",
                    title: labels.monthly_performance_bonus,
                    dataIndex: "monthly_performance_bonus",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "quarterly_performance_bonus",
                    title: labels.quarterly_performance_bonus,
                    dataIndex: "quarterly_performance_bonus",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "annual_performance_bonus",
                    title: labels.annual_performance_bonus,
                    dataIndex: "annual_performance_bonus",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "sale_bonus",
                    title: labels.sale_bonus,
                    dataIndex: "sale_bonus",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "project_bonus",
                    title: labels.project_bonus,
                    dataIndex: "project_bonus",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "bonus_notes",
                    title: labels.bonus_notes,
                    width: 200,
                    dataIndex: "bonus_notes"
                }
            ]
        },
        {
            title: t`Allowance`,
            children: [
                {
                    key: "meal_allowance",
                    title: labels.meal_allowance,
                    dataIndex: "meal_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "phone_allowance",
                    title: labels.phone_allowance,
                    dataIndex: "phone_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "vehicle_allowance",
                    title: labels.vehicle_allowance,
                    dataIndex: "vehicle_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "housing_allowance",
                    title: labels.housing_allowance,
                    dataIndex: "housing_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "attraction_allowance",
                    title: labels.attraction_allowance,
                    dataIndex: "attraction_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "seniority_allowance",
                    title: labels.seniority_allowance,
                    dataIndex: "seniority_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "responsibility_allowance",
                    title: labels.responsibility_allowance,
                    dataIndex: "responsibility_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "concurrently_allowance",
                    title: labels.concurrently_allowance,
                    dataIndex: "concurrently_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "birth_day_allowance",
                    title: labels.birth_day_allowance,
                    dataIndex: "birth_day_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "public_holiday_allowance",
                    title: labels.public_holiday_allowance,
                    dataIndex: "public_holiday_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "health_insurance_allowance",
                    title: labels.health_insurance_allowance,
                    dataIndex: "health_insurance_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "travel_allowance",
                    title: labels.travel_allowance,
                    dataIndex: "travel_allowance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "allowance_notes",
                    title: labels.allowance_notes,
                    width: 200,
                    dataIndex: "allowance_notes"
                }
            ]
        },
        {
            title: "_",
            children: [
                {
                    key: "gross_income",
                    title: labels.gross_income,
                    dataIndex: "gross_income",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "social_insurance",
                    title: labels.social_insurance,
                    dataIndex: "social_insurance",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "personal_tax",
                    title: labels.personal_tax,
                    dataIndex: "personal_tax",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "net_income",
                    title: labels.net_income,
                    dataIndex: "net_income",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                }
            ]
        },
        {
            title: t`Advance / revert amount`,
            children: [
                {
                    key: "advance_amount",
                    title: labels.advance_amount,
                    dataIndex: "advance_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "revert_amount",
                    title: labels.revert_amount,
                    dataIndex: "revert_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "advance_revert_amount_notes",
                    title: labels.advance_revert_amount_notes,
                    width: 200,
                    dataIndex: "advance_revert_amount_notes"
                }
            ]
        },
        {
            title: "_",
            children: [
                {
                    key: "final_settlement_amount",
                    title: labels.final_settlement_amount,
                    dataIndex: "final_settlement_amount",
                    width: 150,
                    render: (value) => <NumberDisplay value={value} />
                },
                {
                    key: "payment_date",
                    title: labels.payment_date,
                    dataIndex: "payment_date",
                    width: 150,
                    render: (value) => <DateDisplay value={value} type="date" />
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

SalaryRecordTable.displayName = "SalaryRecordTable";
