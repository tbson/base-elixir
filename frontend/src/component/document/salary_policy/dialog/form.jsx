import * as React from "react";
import { useParams } from "react-router-dom";
import { Form, InputNumber } from "antd";
import { useRecoilValue } from "recoil";
import DateUtil from "util/date_util";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import { salaryPolicyOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "SalaryPolicyForm";

const dateFields = [];

const emptyRecord = {
    monthly_position_salary: 0,
    monthly_base_salary: 0,
    monthly_performance_bonus: 0,
    quarterly_performance_bonus: 0,
    annual_performance_bonus: 0,
    sale_bonus: 0,
    project_bonus: 0,
    meal_allowance: 0,
    phone_allowance: 0,
    vehicle_allowance: 0,
    housing_allowance: 0,
    attraction_allowance: 0,
    seniority_allowance: 0,
    responsibility_allowance: 0,
    concurrently_allowance: 0,
    birth_day_allowance: 0,
    public_holiday_allowance: 0,
    health_insurance_allowance: 0,
    travel_allowance: 0,
    gross_income: 0,
    ...dateFields.reduce((result, key) => ({ ...result, [key]: "" }), {})
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * SalaryPolicyForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function SalaryPolicyForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const [form] = Form.useForm();
    const salaryPolicyOption = useRecoilValue(salaryPolicyOptionSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;
    for (const field of dateFields) {
        initialValues[field] = initialValues[field]
            ? DateUtil.strToDate(initialValues[field])
            : "";
    }

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        employee_id: {
            name: "employee_id",
            label: labels.employee_id,
            rules: [FormUtil.ruleRequired()]
        },
        monthly_position_salary: {
            name: "monthly_position_salary",
            label: labels.monthly_position_salary
        },
        monthly_base_salary: {
            name: "monthly_base_salary",
            label: labels.monthly_base_salary
        },
        monthly_performance_bonus: {
            name: "monthly_performance_bonus",
            label: labels.monthly_performance_bonus
        },
        quarterly_performance_bonus: {
            name: "quarterly_performance_bonus",
            label: labels.quarterly_performance_bonus
        },
        annual_performance_bonus: {
            name: "annual_performance_bonus",
            label: labels.annual_performance_bonus
        },
        sale_bonus: {
            name: "sale_bonus",
            label: labels.sale_bonus
        },
        project_bonus: {
            name: "project_bonus",
            label: labels.project_bonus
        },
        meal_allowance: {
            name: "meal_allowance",
            label: labels.meal_allowance
        },
        phone_allowance: {
            name: "phone_allowance",
            label: labels.phone_allowance
        },
        vehicle_allowance: {
            name: "vehicle_allowance",
            label: labels.vehicle_allowance
        },
        housing_allowance: {
            name: "housing_allowance",
            label: labels.housing_allowance
        },
        attraction_allowance: {
            name: "attraction_allowance",
            label: labels.attraction_allowance
        },
        seniority_allowance: {
            name: "seniority_allowance",
            label: labels.seniority_allowance
        },
        responsibility_allowance: {
            name: "responsibility_allowance",
            label: labels.responsibility_allowance
        },
        concurrently_allowance: {
            name: "concurrently_allowance",
            label: labels.concurrently_allowance
        },
        birth_day_allowance: {
            name: "birth_day_allowance",
            label: labels.birth_day_allowance
        },
        public_holiday_allowance: {
            name: "public_holiday_allowance",
            label: labels.public_holiday_allowance
        },
        health_insurance_allowance: {
            name: "health_insurance_allowance",
            label: labels.health_insurance_allowance
        },
        travel_allowance: {
            name: "travel_allowance",
            label: labels.travel_allowance
        },
        gross_income: {
            name: "gross_income",
            label: labels.gross_income
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 12 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) => {
                if (companyId) {
                    payload.company_id = companyId;
                }
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form));
            }}
        >
            <Form.Item {...formAttrs.employee_id}>
                <SelectInput
                    options={salaryPolicyOption.employee.selectOptions}
                    block
                />
            </Form.Item>

            <Form.Item {...formAttrs.monthly_position_salary}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.monthly_base_salary}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.monthly_performance_bonus}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.quarterly_performance_bonus}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.annual_performance_bonus}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.sale_bonus}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.project_bonus}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.meal_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.phone_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.vehicle_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.housing_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.attraction_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.seniority_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.responsibility_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.concurrently_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.birth_day_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.public_holiday_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.health_insurance_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.travel_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.gross_income}>
                <InputNumber className="full-width" />
            </Form.Item>
        </Form>
    );
}

SalaryPolicyForm.displayName = formName;
SalaryPolicyForm.formName = formName;
