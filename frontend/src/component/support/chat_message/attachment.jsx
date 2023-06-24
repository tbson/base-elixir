import * as React from "react";
import { FileTextOutlined } from "@ant-design/icons";
import { Message } from "@chatscope/chat-ui-kit-react";

export default function Attachment({ item, attachment, key }) {
    return (
        <Message
            key={key}
            model={{
                direction: getDirection(item.staff_id),
                position: "single",
                sentTime: item.inserted_at,
                sender: item.author_info.name
            }}
        >
            <Message.CustomContent>
                <a href={attachment.url} target="_blank">
                    <FileTextOutlined /> {item.text}
                </a>
            </Message.CustomContent>
        </Message>
    );
}
