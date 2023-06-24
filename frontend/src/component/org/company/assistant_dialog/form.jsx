import * as React from "react";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input } from "antd";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import { assistantUrls, labels } from "../config";

const formName = "AssistantForm";
const emptyRecord = {
    name: "",
    email: "",
    mobile: "",
    pwd: ""
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * AssistantForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function AssistantForm({ data, onChange }) {
    let { id: companyId } = useParams();
    companyId = parseInt(companyId);

    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${assistantUrls.crud}${id}` : assistantUrls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        name: {
            name: "name",
            label: labels.manager.name,
            rules: [FormUtil.ruleRequired()]
        },
        email: {
            name: "email",
            label: labels.manager.email,
            rules: [FormUtil.ruleRequired(), FormUtil.ruleEmail()]
        },
        mobile: {
            name: "mobile",
            label: labels.manager.mobile,
            rules: [FormUtil.ruleRequired()]
        },
        pwd: {
            name: "pwd",
            label: labels.manager.pwd
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
                FormUtil.submit(endPoint, { ...payload, company_id: companyId }, method)
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

AssistantForm.displayName = formName;
AssistantForm.formName = formName;
