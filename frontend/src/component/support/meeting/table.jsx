import * as React from "react";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import {
    ClockCircleOutlined,
    VideoCameraOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { List, Typography } from "antd";
import { Socket } from "phoenix";
import { AddNewBtn, RemoveBtn } from "component/common/table/button";
import PemCheck from "component/common/pem_check";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import DateUtil from "util/date_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import { companyUidSt } from "./state";
import { urls, labels, messages } from "./config";
// import { fi } from "date-fns/locale";

const { Text } = Typography;
const PEM_GROUP = "Meeting";

const socket = new Socket("/api/v1/socket", { params: { token: window.userToken } });
socket.connect();

export default function MeetingTable({ companyUid }) {
    const [list, setList] = useState([]);
    const setCompanyUid = useSetRecoilState(companyUidSt);

    const channel = socket.channel(`room:meeting:${companyUid}`, {});

    function getList() {
        EventUtil.toggleGlobalLoading(true);
        return RequestUtil.apiCall(`${urls.crud}${companyUid}`)
            .then((data) => {
                setList(EnumUtil.ensureReactKey(data.items));
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    }

    useEffect(() => {
        channel.join();
        /*
        .receive("ok", (resp) => {
            console.log("Joined successfully", resp);
        })
        .receive("error", (resp) => {
            console.log("Unable to join", resp);
        });
        */

        channel.on("msg", (payload) => {
            const data = payload.data;
            setList((list) => [data, ...list]);
        });
        return () => {
            channel.leave();
        };
    }, []);

    useEffect(() => {
        setCompanyUid(companyUid);
        getList();
    }, []);

    function onChange(data, id) {
        console.log([data, id]);
        /*
        if (!id) {
            setList([{ ...data, key: data.id }, ...list]);
        } else {
            const index = list.findIndex((item) => item.id === id);
            data.key = data.id;
            list[index] = data;
            setList([...list]);
        }
        */
    }

    function handleGetDetail(uid) {
        EventUtil.toggleGlobalLoading(true);
        RequestUtil.apiCall(`${urls.retrieve}${uid}`)
            .then((data) => {
                window.open(data.link, "_blank");
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    }

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

    return (
        <div>
            <AddNewBtn label="Meeting" onClick={() => Dialog.toggle()} />
            <List
                size="small"
                dataSource={list}
                renderItem={(item) => (
                    <List.Item>
                        <div>
                            <div>
                                <VideoCameraOutlined
                                    className="blue pointer"
                                    onClick={() => handleGetDetail(item.uid)}
                                />{" "}
                                &nbsp;
                                <span>{item.title}</span>
                            </div>
                            <div>
                                <Text code>
                                    <ClockCircleOutlined /> &nbsp;
                                    {DateUtil.datetimeStrToReadableStr(item.start_time)}
                                </Text>
                                &nbsp;
                                <DeleteOutlined
                                    danger
                                    className="red pointer"
                                    onClick={() => onDelete(item.id)}
                                />
                            </div>
                        </div>
                    </List.Item>
                )}
            />
            <Dialog onChange={onChange} />
        </div>
    );
}

MeetingTable.displayName = "MeetingTable";
