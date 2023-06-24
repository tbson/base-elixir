import * as React from "react";
import { t } from "ttag";
import { Button, Tooltip } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    EyeOutlined
} from "@ant-design/icons";

export function AddNewBtn({ onClick, label = "", block = true }) {
    return (
        <Button
            type="primary"
            icon={<PlusOutlined />}
            style={block ? { width: "100%" } : {}}
            onClick={onClick}
        >
            {label}
        </Button>
    );
}

export function RemoveSelectedBtn({ ids, onClick }) {
    return (
        <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={!ids.length}
            onClick={() => onClick(ids)}
        />
    );
}

export function EditBtn({ onClick, className = "" }) {
    return (
        <Tooltip title={t`Update`}>
            <Button
                className={className}
                type="default"
                htmlType="button"
                icon={<EditOutlined />}
                size="small"
                title="hello"
                onClick={onClick}
            />
        </Tooltip>
    );
}

export function RemoveBtn({ onClick }) {
    return (
        <Tooltip title={t`Remove`}>
            <Button
                danger
                type="default"
                htmlType="button"
                icon={<DeleteOutlined />}
                size="small"
                onClick={onClick}
            />
        </Tooltip>
    );
}

export function ViewBtn({ onClick = null }) {
    if (!onClick) {
        onClick = () => {};
    }
    return (
        <Tooltip title={t`View`}>
            <Button
                type="default"
                htmlType="button"
                icon={<EyeOutlined />}
                size="small"
                onClick={onClick}
            />
        </Tooltip>
    );
}
