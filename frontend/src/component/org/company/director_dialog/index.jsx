import * as React from "react";
import { useState, useEffect } from "react";
import { t } from "ttag";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import RequestUtil from "util/request_util";
import Form from "./form";
import { directorUrls as urls } from "../config";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_DIRECTOR_DIALOG";
    }

    static toggle(open = true, id = 0) {
        EventUtil.event.dispatch(Service.toggleEvent, { open, id });
    }
}

/**
 * DirectorDialog.
 *
 * @param {Object} props
 * @param {function} props.onChange - (data: Dict, id: number) => void
 */
export default function DirectorDialog({ onChange }) {
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);

    const handleToggle = ({ detail: { open, id } }) => {
        if (!open) return setOpen(false);
        if (id) {
            EventUtil.toggleGlobalLoading();
            RequestUtil.apiCall(`${urls.crud}${id}`)
                .then((data) => {
                    console.log(data);
                    setData(data);
                    setOpen(true);
                })
                .finally(() => EventUtil.toggleGlobalLoading(false));
        } else {
            setData({});
            setOpen(true);
        }
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
            title={t`Add new director`}
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

DirectorDialog.displayName = "DirectorDialog";
DirectorDialog.toggle = Service.toggle;
