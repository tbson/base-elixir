import * as React from "react";
import { t } from "ttag";
import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Form, Input, InputNumber, Divider } from "antd";
import { useRecoilValue } from "recoil";
import DateUtil from "util/date_util";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import TreeInput from "component/common/form/ant/input/tree_input";
import SelectInput from "component/common/form/ant/input/select_input";
import DateInput from "component/common/form/ant/input/date_input";
import { salaryRecordOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "SalaryRecordForm";

const dateFields = ["date", "payment_date"];

const emptyRecord = {
    working_days: 0,
    ot_days: 0,
    base_salary: 0,
    ot_salary: 0,
    monthly_performance_bonus: 0,
    quarterly_performance_bonus: 0,
    annual_performance_bonus: 0,
    sale_bonus: 0,
    project_bonus: 0,
    bonus_notes: "",
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
    allowance_notes: "",
    gross_income: 0,
    social_insurance: 0,
    personal_tax: 0,
    net_income: 0,
    advance_amount: 0,
    revert_amount: 0,
    advance_revert_amount_notes: "",
    final_settlement_amount: 0,
    ...dateFields.reduce((result, key) => ({ ...result, [key]: "" }), {})
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * SalaryRecordForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function SalaryRecordForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const salaryRecordOption = useRecoilValue(salaryRecordOptionSt);
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
        date: { name: "date", label: labels.date, rules: [FormUtil.ruleRequired()] },
        working_days: {
            name: "working_days",
            label: labels.working_days
        },
        ot_days: {
            name: "ot_days",
            label: labels.ot_days
        },
        base_salary: {
            name: "base_salary",
            label: labels.base_salary
        },
        ot_salary: {
            name: "ot_salary",
            label: labels.ot_salary
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
        bonus_notes: {
            name: "bonus_notes",
            label: labels.bonus_notes
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
        allowance_notes: {
            name: "allowance_notes",
            label: labels.allowance_notes
        },
        gross_income: {
            name: "gross_income",
            label: labels.gross_income
        },
        social_insurance: {
            name: "social_insurance",
            label: labels.social_insurance
        },
        personal_tax: {
            name: "personal_tax",
            label: labels.personal_tax
        },
        net_income: {
            name: "net_income",
            label: labels.net_income
        },
        advance_amount: {
            name: "advance_amount",
            label: labels.advance_amount
        },
        revert_amount: {
            name: "revert_amount",
            label: labels.revert_amount
        },
        advance_revert_amount_notes: {
            name: "advance_revert_amount_notes",
            label: labels.advance_revert_amount_notes
        },
        final_settlement_amount: {
            name: "final_settlement_amount",
            label: labels.final_settlement_amount
        },
        payment_date: {
            name: "payment_date",
            label: labels.payment_date
        }
    };

    useEffect(() => {
        // inputRef.current.focus({ cursor: "end" });
    }, []);

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
            {/*
            <Form.Item {...formAttrs.uid}>
                <Input ref={inputRef} />
            </Form.Item>
            */}
            <Form.Item {...formAttrs.employee_id}>
                <SelectInput
                    options={salaryRecordOption.employee.selectOptions}
                    block
                />
            </Form.Item>
            <Form.Item {...formAttrs.date}>
                <DateInput props={{ picker: "month" }} className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.working_days}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.ot_days}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.base_salary}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.ot_salary}>
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
            <Form.Item {...formAttrs.bonus_notes}>
                <Input className="full-width" />
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
            <Form.Item {...formAttrs.allowance_notes}>
                <Input className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.gross_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.social_insurance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.personal_tax}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.net_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.advance_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.revert_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.advance_revert_amount_notes}>
                <Input className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.final_settlement_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.payment_date}>
                <DateInput className="full-width" />
            </Form.Item>{" "}
        </Form>
    );
}

SalaryRecordForm.displayName = formName;
SalaryRecordForm.formName = formName;
