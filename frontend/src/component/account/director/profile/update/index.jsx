import * as React from "react";
import { useState, useEffect } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import Form from "./form";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_UPDATE_DIRECTOR_PROFILE_DIALOG";
    }

    static toggle(open = true, data) {
        EventUtil.event.dispatch(Service.toggleEvent, { open, data });
    }
}

export default function UpdateDirectorProfile({ onChange }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});

    const handleToggle = ({ detail: { open, data } }) => {
        setOpen(open);
        setData(data);
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
            width="70%"
            open={open}
            okButtonProps={{ form: Form.formName, key: "submit", htmlType: "submit" }}
            okText={t`Update profile`}
            onCancel={() => Service.toggle(false)}
            cancelText={t`Cancel`}
            title={t`Update director profile`}
        >
            <Form
                data={data}
                onChange={(data) => {
                    setOpen(false);
                    onChange(data);
                }}
            />
        </Modal>
    );
}

UpdateDirectorProfile.displayName = "UpdateDirectorProfile";
UpdateDirectorProfile.toggle = Service.toggle;
