import React from "react";
import { format, parseISO } from "date-fns";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export const DATETIME_REABLE_FORMAT = "dd/MM/yyyy HH:mm:ss";
export const DATE_REABLE_FORMAT = "dd/MM/yyyy";
export const MONTH_REABLE_FORMAT = "MM/yyyy";
export const YEAR_REABLE_FORMAT = "yyyy";

export function BoolDisplay({ value = true }) {
    return value ? (
        <CheckOutlined className="green" />
    ) : (
        <CloseOutlined className="red" />
    );
}

export function NumberDisplay({ value }) {
    try {
        return <span>{value.toLocaleString("en")}</span>;
    } catch (_e) {
        return <span>NaN</span>;
    }
}

export function DateDisplay({ value, type = "date" }) {
    try {
        const date = parseISO(value);
        if (!date) return null;
        switch (type) {
            case "datetime":
                return <span>{format(date, DATETIME_REABLE_FORMAT)}</span>;
            case "date":
                return <span>{format(date, DATE_REABLE_FORMAT)}</span>;
            case "month":
                return <span>{format(date, MONTH_REABLE_FORMAT)}</span>;
            case "year":
                return <span>{format(date, YEAR_REABLE_FORMAT)}</span>;
            default:
                return <span>{format(date, DATETIME_REABLE_FORMAT)}</span>;
        }
    } catch (_e) {
        return null;
    }
}
