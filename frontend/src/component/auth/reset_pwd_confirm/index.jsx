import * as React from "react";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import Form from "./form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_RESET_PASSWORD_CONFIRM_DIALOG";
    }

    static toggle(open = true) {
        EventUtil.event.dispatch(Service.toggleEvent, { open });
    }
}

export default function ResetPwdConfirm() {
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open } }) => setOpen(open);

    useEffect(() => {
        EventUtil.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            EventUtil.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    return (
        <Modal
            destroyOnClose={true}
            open={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText="OK"
            onCancel={() => Service.toggle(false)}
            cancelText="Thoát"
            title="Khôi phục mật khẩu"
        >
            <Form
                onChange={() => {
                    setOpen(false);
                }}
            />
        </Modal>
    );
}

ResetPwdConfirm.displayName = "ResetPwdConfirm";
ResetPwdConfirm.toggle = Service.toggle;
