import * as React from "react";
import { useRef, useEffect } from "react";
import { Form } from "antd";
import { useRecoilValue } from "recoil";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import { assigningCompanyOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "AssigningCompanyForm";
const emptyRecord = {
    company_id: null,
    staff_id: null
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * AssigningCompanyForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function AssigningCompanyForm({ data, onChange }) {
    const [form] = Form.useForm();
    const assigningCompanyOption = useRecoilValue(assigningCompanyOptionSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        company_id: {
            name: "company_id",
            label: labels.company_name,
            rules: [FormUtil.ruleRequired()]
        },
        staff_id: {
            name: "staff_id",
            label: labels.staff_name,
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
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.company_id}>
                <SelectInput
                    options={assigningCompanyOption.company.selectOptions}
                    block
                />
            </Form.Item>
            <Form.Item {...formAttrs.staff_id}>
                <SelectInput
                    options={assigningCompanyOption.staff.selectOptions}
                    block
                />
            </Form.Item>
        </Form>
    );
}

AssigningCompanyForm.displayName = formName;
AssigningCompanyForm.formName = formName;
