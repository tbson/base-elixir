import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { t } from "ttag";
import { Modal } from "antd";
import EventUtil from "util/event_util";
import DialogUtil from "util/dialog_util";
import RequestUtil from "util/request_util";
import Form from "./form";
import { urls, messages } from "../config";

export class Service {
    static get toggleEvent() {
        return "TOGGLE_SALARY_RECORD_DIALOG";
    }

    static toggle(open = true, id = 0) {
        EventUtil.event.dispatch(Service.toggleEvent, { open, id });
    }
}

/**
 * SalaryRecordDialog.
 *
 * @param {Object} props
 * @param {function} props.onChange - (data: Dict, id: number) => void
 */
export default function SalaryRecordDialog({ onChange }) {
    const { id: companyIdRaw } = useParams();
    const companyId = parseInt(companyIdRaw);
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const handleToggle = ({ detail: { open, id } }) => {
        if (!open) return setOpen(false);
        setId(id);
        if (id) {
            EventUtil.toggleGlobalLoading();
            RequestUtil.apiCall(`${urls.crud}${id}`, { company_id: companyId })
                .then((data) => {
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
            title={DialogUtil.getDialogTitle(id, messages)}
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

SalaryRecordDialog.displayName = "SalaryRecordDialog";
SalaryRecordDialog.toggle = Service.toggle;
