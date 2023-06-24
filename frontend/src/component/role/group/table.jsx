import * as React from "react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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
import OptionUtil from "util/option_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { groupOptionSt } from "./state";
import { urls, labels, messages } from "./config";

const PEM_GROUP = "Group";

export default function GroupTable() {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    const [ids, setIds] = useState([]);
    const [links, setLinks] = useState(defaultLinks);
    const [searchParam, setSearchParam] = useState("");
    const [cursorParam, setCursorParam] = useState({});
    const [sortParams, setSortParams] = useState({});

    const [_groupOption, setGroupOption] = useRecoilState(groupOptionSt);

    function getQueryParams() {
        const params = {};
        if (searchParam) {
            params.search = searchParam;
        }

        return { ...params, ...cursorParam, ...sortParams };
    }

    function getList() {
        const params = getQueryParams();
        setLoading(true);
        return RequestUtil.apiCall(urls.crud, params)
            .then((data) => {
                setLinks(data.links);
                setList(EnumUtil.ensureReactKey(data.items));
                setGroupOption(OptionUtil.getAllOptions(data.extra.option));
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
    }, [searchParam, cursorParam]);

    const onDelete = (id) => {
        const r = window.confirm(messages.deleteOne);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(`${urls.crud}${id}`, {}, "delete")
            .then(() => {
                setList([...list.filter((item) => item.id !== id)]);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    };

    const onBulkDelete = (ids) => {
        const r = window.confirm(messages.deleteMultiple);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(`${urls.crud}?ids=${ids.join(",")}`, {}, "delete")
            .then(() => {
                setList([...list.filter((item) => !ids.includes(item.id))]);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    };

    const onChange = (data, id) => {
        if (!id) {
            setList([{ ...data, key: data.id }, ...list]);
        } else {
            const index = list.findIndex((item) => item.id === id);
            data.key = data.id;
            list[index] = data;
            setList([...list]);
        }
    };
    const columns = [
        {
            key: "title",
            title: labels.title,
            dataIndex: "title",
            sorter: true
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

GroupTable.displayName = "GroupTable";
