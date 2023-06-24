import * as React from "react";
import { useParams } from "react-router-dom";
import ChatMessageList from "./list";

let openedChatWindow = null;
export class ChatMessageService {
    static setOpenedChatWindow(value) {
        openedChatWindow = value;
    }

    static getOpenedChatWindow() {
        return openedChatWindow;
    }
}

/*
    This component is used to force a re-render of the ChatMessageList component
    when navigating bewteen companies.
*/
export default function ChatMessage() {
    let { companyUid } = useParams();
    return <ChatMessageList key={companyUid} />;
}
