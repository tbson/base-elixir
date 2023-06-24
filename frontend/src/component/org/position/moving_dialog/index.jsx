import * as React from "react";
import { useState, useEffect } from "react";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import Form from "./form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_POSITION_MOVING_DIALOG";
    }

    static toggle(open = true, id = 0) {
        EventUtil.event.dispatch(Service.toggleEvent, { open, id });
    }
}

/**
 * PositionMovingDialog.
 *
 * @param {Object} props
 * @param {function} props.onChange - () => void
 */
export default function PositionMovingDialog({ onChange }) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const handleToggle = ({ detail: { open, id } }) => {
        if (!open) return setOpen(false);
        setId(id);
        setTimeout(() => setOpen(true), 200);
    };

    useEffect(() => {
        EventUtil.event.listen(Service.toggleEvent, handleToggle);
        return () => {
            EventUtil.event.remove(Service.toggleEvent, handleToggle);
        };
    }, []);

    const modalTitle = "Di chuyển đến";

    return (
        <Modal
            keyboard={false}
            maskClosable={false}
            destroyOnClose
            open={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText="OK"
            onCancel={() => Service.toggle(false)}
            cancelText="Thoát"
            title={modalTitle}
        >
            <Form
                id={id}
                onChange={() => {
                    setOpen(false);
                    onChange();
                }}
            />
        </Modal>
    );
}

PositionMovingDialog.displayName = "PositionMovingDialog";
PositionMovingDialog.toggle = Service.toggle;
