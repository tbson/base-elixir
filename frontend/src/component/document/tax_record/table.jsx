import * as React from "react";
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
import { NumberDisplay, DateDisplay } from "component/common/display";
import PemCheck from "component/common/pem_check";
import DateUtil from "util/date_util";
import OptionUtil from "util/option_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { taxRecordOptionSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "TaxRecord";

export default function TaxRecordTable({ date }) {
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

    const setTaxRecordOption = useSetRecoilState(taxRecordOptionSt);

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
                setTaxRecordOption(OptionUtil.getAllOptions(data.extra.option));
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
            key: "uid",
            title: labels.uid,
            dataIndex: ["employee", "uid"],
            width: 150,
            sorter: true
        },
        {
            key: "name",
            title: labels.name,
            dataIndex: ["employee", "name"]
        },
        {
            key: "email",
            title: labels.email,
            dataIndex: ["employee", "email"]
        },
        {
            key: "phone_number",
            title: labels.phone_number,
            dataIndex: ["employee", "phone_number"]
        },
        {
            key: "title",
            title: labels.title,
            dataIndex: ["employee", "title"]
        },
        {
            key: "department",
            title: labels.department,
            dataIndex: ["employee", "department"]
        },
        {
            key: "date",
            title: labels.date,
            dataIndex: "date",
            render: (value) => <DateDisplay value={value} type="month" />
        },
        {
            key: "monthly_income",
            title: labels.monthly_income,
            dataIndex: "monthly_income",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "pretax_income",
            title: labels.pretax_income,
            dataIndex: "pretax_income",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "personal_allowance",
            title: labels.personal_allowance,
            dataIndex: "personal_allowance",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "family_allowance_members",
            title: labels.family_allowance_members,
            dataIndex: "family_allowance_members",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "family_allowance",
            title: labels.family_allowance,
            dataIndex: "family_allowance",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "deducted_income",
            title: labels.deducted_income,
            dataIndex: "deducted_income",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "taxable_income",
            title: labels.taxable_income,
            dataIndex: "taxable_income",

            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "tax_rate",
            title: labels.tax_rate,
            dataIndex: "tax_rate",
            render: (value) => <NumberDisplay value={value} />
        },
        {
            key: "personal_income_tax",
            title: labels.personal_income_tax,
            dataIndex: "personal_income_tax",
            render: (value) => <NumberDisplay value={value} />
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

TaxRecordTable.displayName = "TaxRecordTable";
