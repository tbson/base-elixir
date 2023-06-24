import * as React from "react";
import { useRef, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Form, Input } from "antd";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import { employeeOptionSt } from "../state";
import { urlsInviteEmployee, labels } from "../config";
import { PLATFORM } from "src/consts";

const formName = "EmployeeCrudForm";
const emptyRecord = {
    name: "",
    email: "",
    group_ids: []
};
/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * EmployeeCrudForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function EmployeeCrudForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const employeeOption = useRecoilValue(employeeOptionSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;

    const endPoint = urlsInviteEmployee.inviteEmployee;
    const method = "post";

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
        group_ids: {
            name: "group_ids",
            label: labels.group_ids,
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
            onFinish={(data) => {
                const payload = {
                    group_ids: data.group_ids,
                    personal_info: {
                        name: data.name,
                        email: data.email,
                        platform: PLATFORM.facebook
                    }
                };
                return FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, null))
                    .catch(FormUtil.setFormErrors(form));
            }}
        >
            <Form.Item {...formAttrs.name}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.email}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.group_ids}>
                <SelectInput
                    mode="multiple"
                    options={employeeOption.group.selectOptions}
                    block
                />
            </Form.Item>
        </Form>
    );
}

EmployeeCrudForm.displayName = formName;
EmployeeCrudForm.formName = formName;
