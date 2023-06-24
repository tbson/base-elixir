import * as React from "react";
import { useRef, useEffect } from "react";
import { Form, Input } from "antd";
import { useRecoilValue } from "recoil";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import { variableOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "VariableForm";
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
 * VariableForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function VariableForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const variableOption = useRecoilValue(variableOptionSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        id: {
            name: "id",
            label: labels.id,
            rules: [FormUtil.ruleRequired()]
        },
        value: {
            name: "value",
            label: labels.value
        },
        description: {
            name: "description",
            label: labels.description
        },
        type: {
            name: "type",
            label: labels.type
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
            <Form.Item {...formAttrs.id}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.value}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.description}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.type}>
                <SelectInput
                    options={variableOption.variableType.selectOptions}
                    block
                />
            </Form.Item>
        </Form>
    );
}

VariableForm.displayName = formName;
VariableForm.formName = formName;
