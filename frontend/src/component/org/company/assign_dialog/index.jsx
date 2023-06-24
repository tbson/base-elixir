import * as React from "react";
import { useState, useEffect } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import DialogUtil from "util/dialog_util";
import RequestUtil from "util/request_util";
import Form from "./form";
import { urls, messages } from "../config";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_COMPANY_ASSIGN_DIALOG";
    }

    static toggle(open = true, data) {
        EventUtil.event.dispatch(Service.toggleEvent, { open, data });
    }
}

/**
 * CompanyAssignDialog.
 *
 * @param {Object} props
 * @param {function} props.onChange - (data: Dict, id: number) => void
 */
export default function CompanyAssignDialog({ onChange }) {
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open, data } }) => {
        if (!open) return setOpen(false);
        setData(data);
        setOpen(true);
    };

    useEffect(() => {
        EventUtil.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            EventUtil.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            keyboard={false}
            maskClosable={false}
            destroyOnClose
            open={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText={t`Save`}
            onCancel={() => Service.toggle(false)}
            cancelText={t`Cancel`}
            title={t`Update support staff`}
            width="60%"
        >
            <Form
                data={data}
                onChange={(data, id) => {
                    setOpen(false);
                    onChange(data, id);
                }}
            />
        </Modal>
    );
}

CompanyAssignDialog.displayName = "CompanyAssignDialog";
CompanyAssignDialog.toggle = Service.toggle;
