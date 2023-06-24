import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    FileTextOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FileZipOutlined,
    FileOutlined
} from "@ant-design/icons";

import { Socket } from "phoenix";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar
} from "@chatscope/chat-ui-kit-react";
import MeetingTable from "component/support/meeting/table";
import RequestUtil from "util/request_util";
import EnumUtil from "util/enum_util";
import { PROFILE_TYPE } from "src/consts";
import StorageUtil from "util/storage_util";
import { ChatMessageService } from "component/support/chat_message";
import { urls } from "./config";

const socket = new Socket("/api/v1/socket", { params: { token: window.userToken } });
socket.connect();

export default function ChatMessageList() {
    let { companyUid } = useParams();
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [messageList, setMessageList] = useState([]);
    const [attachments, setAttachments] = useState(null);

    const auth = StorageUtil.getStorageObj("auth");
    const profileType = parseInt(auth.profile_type || "0");
    if ([PROFILE_TYPE.director, PROFILE_TYPE.assistant].includes(profileType)) {
        companyUid = auth.company.uid;
    }

    useEffect(() => {
        ChatMessageService.setOpenedChatWindow(companyUid);
        const channel = socket.channel(`room:chat-message:${companyUid}`, {});
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
            // console.log(payload);
            const data = payload.data;
            setMessageList((list) => [...list, data]);
        });
        return () => {
            ChatMessageService.setOpenedChatWindow(null);
            channel.leave();
        };
    }, []);

    useEffect(() => {
        getChatList();
    }, []);

    function getChatList() {
        let params = {};
        if (companyUid) {
            params.company_uid = companyUid;
        }
        if (cursor) {
            params.next = cursor;
        }
        return RequestUtil.apiCall(urls.chat, params).then((data) => {
            const listItem = EnumUtil.ensureReactKey(data.items);
            setCursor(data.links.next);
            setMessageList([...listItem, ...messageList]);
        });
    }

    function attachClickHandle(_e) {
        const input = document.createElement("input");
        input.type = "file";
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!text) {
                setText(file.name);
            }
            setAttachments(file);
        };
        input.click();
    }

    function sendHandle(text) {
        let payload = { text };
        if (companyUid) {
            payload.company_uid = companyUid;
        }
        if (attachments) {
            payload = { ...payload, file: attachments };
        }
        setSending(true);
        return RequestUtil.apiCall(urls.chat, payload, "post")
            .then((data) => {
                console.log(data);
                // setMessageList((list) => [...list, data]);
            })
            .finally(() => {
                setText("");
                setAttachments(null);
                setSending(false);
            });
    }

    function handleLoadMore(e) {
        if (!cursor) return;
        getChatList();
    }

    function getDirection(staff_id) {
        const auth = StorageUtil.getStorageObj("auth");
        const profileType = parseInt(auth.profile_type || "0");
        if (
            [PROFILE_TYPE.admin, PROFILE_TYPE.staff].includes(profileType) &&
            staff_id
        ) {
            return "incoming";
        }
        if (
            ![PROFILE_TYPE.admin, PROFILE_TYPE.staff].includes(profileType) &&
            !staff_id
        ) {
            return "incoming";
        }
        return "outgoing";
    }

    function getFileTypeIcon(fileType) {
        const style = { fontSize: "30px" };
        switch (fileType) {
            case "text":
                return <FileTextOutlined style={style} />;
            case "pdf":
                return <FilePdfOutlined style={style} />;
            case "document":
                return <FileWordOutlined style={style} />;
            case "spreadsheet":
                return <FileExcelOutlined style={style} />;
            case "archive":
                return <FileZipOutlined style={style} />;
            default:
                return <FileOutlined style={style} />;
        }
    }

    return (
        <div style={{ height: "calc(100vh - 68px)" }}>
            <MainContainer responsive>
                <ChatContainer>
                    <MessageList onYReachStart={handleLoadMore}>
                        {messageList
                            .map((item) =>
                                [
                                    item.text ? (
                                        <Message
                                            key={item.time}
                                            model={{
                                                direction: getDirection(item.staff_id),
                                                position: "single",
                                                message: item.text,
                                                sentTime: item.inserted_at,
                                                sender: item.author_info.name
                                            }}
                                        />
                                    ) : null
                                ].concat(
                                    item.attachments.map((attachment, index) => {
                                        const key = item.id + index + 1;
                                        if (attachment.type === "image") {
                                            return (
                                                <Message
                                                    type={attachment.type}
                                                    key={key}
                                                    model={{
                                                        direction: getDirection(
                                                            item.staff_id
                                                        ),
                                                        payload: {
                                                            src: attachment.url,
                                                            height: 100
                                                        }
                                                    }}
                                                />
                                            );
                                        }
                                        return (
                                            <Message
                                                key={key}
                                                model={{
                                                    direction: getDirection(
                                                        item.staff_id
                                                    ),
                                                    position: "single",
                                                    sentTime: item.inserted_at,
                                                    sender: item.author_info.name
                                                }}
                                            >
                                                <Message.CustomContent>
                                                    <a
                                                        href={attachment.url}
                                                        target="_blank"
                                                    >
                                                        {getFileTypeIcon(
                                                            attachment.type
                                                        )}{" "}
                                                        {attachment.url
                                                            .split("/")
                                                            .pop()}
                                                    </a>
                                                </Message.CustomContent>
                                            </Message>
                                        );
                                    })
                                )
                            )
                            .flatMap((item) => item)}
                    </MessageList>
                    <MessageInput
                        sendDisabled={!text || sending}
                        value={text}
                        onChange={setText}
                        placeholder="Type message here"
                        onAttachClick={attachClickHandle}
                        onSend={sendHandle}
                    />
                </ChatContainer>
                <Sidebar position="right">
                    <MeetingTable companyUid={companyUid} />
                </Sidebar>
            </MainContainer>
        </div>
    );
}
