import * as React from "react";
import { useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Form, Input } from "antd";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import DateInput from "component/common/form/ant/input/date_input";
import { companyUidSt } from "../state";
import { urls, labels } from "../config";

const formName = "MeetingForm";
const emptyRecord = {
    id: "",
    value: "",
    description: "",
    type: 1
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * MeetingForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function MeetingForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const companyUid = useRecoilValue(companyUidSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = `${urls.crud}${companyUid}`;
    const method = "post";

    const formAttrs = {
        title: {
            name: "title",
            label: labels.title,
            rules: [FormUtil.ruleRequired()]
        },
        start_time: {
            name: "start_time",
            label: labels.start_time,
            rules: [FormUtil.ruleRequired()]
        }
    };

    useEffect(() => {
        inputRef.current.focus({ cursor: "end" });
    }, []);

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.title}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.start_time}>
                <DateInput props={{ showTime: true }} />
            </Form.Item>
        </Form>
    );
}

MeetingForm.displayName = formName;
MeetingForm.formName = formName;
