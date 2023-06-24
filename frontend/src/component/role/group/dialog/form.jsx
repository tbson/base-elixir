import * as React from "react";
import { useRef, useEffect } from "react";
import { Form, Input } from "antd";
import { useRecoilValue } from "recoil";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import TransferInput from "component/common/form/ant/input/transfer_input.jsx";
import { groupOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "GroupForm";
export const emptyRecord = {
    id: 0,
    title: "",
    pems: []
};

/**
 * GroupForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 * @param {Object} props.formRef
 */
export default function GroupForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const groupOption = useRecoilValue(groupOptionSt);
    const initValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initValues.id;
    const url = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        title: {
            name: "title",
            label: labels.title,
            rules: [FormUtil.ruleRequired()]
        },
        pem_ids: {
            name: "pem_ids",
            label: labels.pem_ids,
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
            layout="vertical"
            initialValues={{ ...initValues }}
            onFinish={(payload) =>
                FormUtil.submit(url, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.title}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.pem_ids}>
                <TransferInput options={groupOption.pem.transferOptions} />
            </Form.Item>
        </Form>
    );
}

GroupForm.displayName = formName;
GroupForm.formName = formName;
