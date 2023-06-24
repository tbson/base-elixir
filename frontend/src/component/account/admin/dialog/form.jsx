import * as React from "react";
import { useRef, useEffect } from "react";
import { Form, Input } from "antd";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import { urls, labels } from "../config";

const formName = "AdminForm";
const emptyRecord = {
    name: "",
    email: "",
    pwd: ""
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * AdminForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function AdminForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        name: {
            name: "name",
            label: labels.name,
            rules: [FormUtil.ruleRequired()]
        },
        email: {
            name: "email",
            label: labels.email,
            rules: [FormUtil.ruleRequired(), FormUtil.ruleEmail()]
        },
        mobile: {
            name: "mobile",
            label: labels.mobile,
            rules: [FormUtil.ruleRequired()]
        },
        pwd: {
            name: "pwd",
            label: labels.pwd
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
            <Form.Item {...formAttrs.name}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.email}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.mobile}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.pwd}>
                <Input type="password" />
            </Form.Item>
        </Form>
    );
}

AdminForm.displayName = formName;
AdminForm.formName = formName;
