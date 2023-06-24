import * as React from "react";
import { Form } from "antd";
import { useRecoilValue } from "recoil";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import { companyOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "CompanyAssignForm";
const emptyRecord = {
    staff_id: null
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * CompanyAssignForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function CompanyAssignForm({ data, onChange }) {
    const [form] = Form.useForm();
    const companyOption = useRecoilValue(companyOptionSt);
    const id = data.company_id;
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const endPoint = urls.assign;
    const method = "post";

    const formAttrs = {
        staff_id: {
            name: "staff_id",
            label: labels.staff,
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) =>
                FormUtil.submit(endPoint, { ...payload, company_id: id }, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.staff_id}>
                <SelectInput options={companyOption.staff.selectOptions} block />
            </Form.Item>
        </Form>
    );
}

CompanyAssignForm.displayName = formName;
CompanyAssignForm.formName = formName;
