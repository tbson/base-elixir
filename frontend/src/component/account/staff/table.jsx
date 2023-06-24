import * as React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Table } from "antd";
import Pagination, { defaultLinks } from "component/common/table/pagination";
import SearchInput from "component/common/table/search_input";
import {
    AddNewBtn,
    RemoveSelectedBtn,
    EditBtn,
    RemoveBtn
} from "component/common/table/button";
import PemCheck from "component/common/pem_check";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const PEM_GROUP = "Staff";

export default function StaffTable() {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);
    const [searchParam, setSearchParam] = useState("");
    const [cursorParam, setCursorParam] = useState({});
    const [filterParams, setFilterParams] = useState({});
    const [sortParams, setSortParams] = useState({});

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
            list[index] = data;
            setList([...list]);
        }
    }

    const columns = [
        {
            key: "id",
            title: labels.id,
            dataIndex: "id",
            sorter: true,
            width: 50
        },
        {
            key: "name",
            title: labels.name,
            dataIndex: "name"
        },
        {
            key: "email",
            title: labels.email,
            dataIndex: "email"
        },
        {
            key: "mobile",
            title: labels.mobile,
            dataIndex: "mobile"
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
                scroll={{ x: 1000 }}
                pagination={false}
                onChange={(_pagination, filters, sorter) => {
                    const filterParams = Object.entries(filters).reduce(
                        (acc, [k, v]) => {
                            if (v) {
                                acc[k] = v[0];
                                return acc;
                            }
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

StaffTable.displayName = "StaffTable";
