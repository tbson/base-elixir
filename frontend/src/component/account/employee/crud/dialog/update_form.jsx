import * as React from "react";
import { Form } from "antd";
import { useRecoilValue } from "recoil";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import CheckInput from "component/common/form/ant/input/check_input";
import { employeeOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "EmployeeCrudUpdateForm";

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
    const [form] = Form.useForm();
    const employeeOption = useRecoilValue(employeeOptionSt);
    const id = data.id;

    const endPoint = `${urls.crud}${id}`;
    const method = "put";

    const formAttrs = {
        group_ids: {
            name: "group_ids",
            label: labels.group_ids,
            rules: [FormUtil.ruleRequired()]
        },
        enabled: {
            name: "enabled",
            label: labels.enabled
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...data }}
            onFinish={(payload) =>
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.group_ids}>
                <SelectInput
                    mode="multiple"
                    options={employeeOption.group.selectOptions}
                    block
                />
            </Form.Item>

            <Form.Item {...formAttrs.enabled}>
                <CheckInput />
            </Form.Item>
        </Form>
    );
}

EmployeeCrudForm.displayName = formName;
EmployeeCrudForm.formName = formName;
