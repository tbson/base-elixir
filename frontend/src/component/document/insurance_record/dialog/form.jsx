import * as React from "react";
import { t } from "ttag";
import { useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import { Form, InputNumber, Divider } from "antd";
import { useRecoilValue } from "recoil";
import DateUtil from "util/date_util";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import SelectInput from "component/common/form/ant/input/select_input";
import CheckInput from "component/common/form/ant/input/check_input";
import DateInput from "component/common/form/ant/input/date_input";
import { insuranceRecordOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "InsuranceRecordForm";

const dateFields = ["date"];

const emptyRecord = {
    applied_salary: 0,
    applied_benefit: 0,
    employee_retirement_fund: 0,
    employee_medical_insurance_fund: 0,
    employee_voluntary_insurance_fund: 0,
    employee_paid_amount: 0,
    company_retirement_fund: 0,
    company_sickness_maternity_fund: 0,
    company_accident_occupational_disease_fund: 0,
    company_medical_insurance_fund: 0,
    company_voluntary_insurance_fund: 0,
    company_paid_amount: 0,
    union_fee: 0,
    company_total_paid_amount: 0,
    company_total_paid_amount_with_union_fee: 0,
    ...dateFields.reduce((result, key) => ({ ...result, [key]: "" }), {})
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * InsuranceRecordForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function InsuranceRecordForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const insuranceRecordOption = useRecoilValue(insuranceRecordOptionSt);
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
        applied_salary: {
            name: "applied_salary",
            label: labels.applied_salary
        },
        applied_benefit: {
            name: "applied_benefit",
            label: labels.applied_benefit
        },
        is_social_insurance_target: {
            name: "is_social_insurance_target",
            label: labels.is_social_insurance_target
        },
        employee_retirement_fund: {
            name: "employee_retirement_fund",
            label: labels.employee_retirement_fund
        },
        employee_medical_insurance_fund: {
            name: "employee_medical_insurance_fund",
            label: labels.employee_medical_insurance_fund
        },
        employee_voluntary_insurance_fund: {
            name: "employee_voluntary_insurance_fund",
            label: labels.employee_voluntary_insurance_fund
        },
        employee_paid_amount: {
            name: "employee_paid_amount",
            label: labels.employee_paid_amount
        },
        company_retirement_fund: {
            name: "company_retirement_fund",
            label: labels.company_retirement_fund
        },
        company_sickness_maternity_fund: {
            name: "company_sickness_maternity_fund",
            label: labels.company_sickness_maternity_fund
        },
        company_accident_occupational_disease_fund: {
            name: "company_accident_occupational_disease_fund",
            label: labels.company_accident_occupational_disease_fund
        },
        company_medical_insurance_fund: {
            name: "company_medical_insurance_fund",
            label: labels.company_medical_insurance_fund
        },
        company_voluntary_insurance_fund: {
            name: "company_voluntary_insurance_fund",
            label: labels.company_voluntary_insurance_fund
        },
        company_paid_amount: {
            name: "company_paid_amount",
            label: labels.company_paid_amount
        },
        union_fee: {
            name: "union_fee",
            label: labels.union_fee
        },
        company_total_paid_amount: {
            name: "company_total_paid_amount",
            label: labels.company_total_paid_amount
        },
        company_total_paid_amount_with_union_fee: {
            name: "company_total_paid_amount_with_union_fee",
            label: labels.company_total_paid_amount_with_union_fee
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
                    options={insuranceRecordOption.employee.selectOptions}
                    block
                />
            </Form.Item>
            <Form.Item {...formAttrs.date}>
                <DateInput props={{ picker: "month" }} className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.applied_salary}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.applied_benefit}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.is_social_insurance_target}>
                <CheckInput />
            </Form.Item>
            <Divider orientation="right">{t`Employee responsibility`}</Divider>
            <Form.Item {...formAttrs.employee_retirement_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.employee_medical_insurance_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.employee_voluntary_insurance_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.employee_paid_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Divider orientation="right">{t`Company responsibility`}</Divider>
            <Form.Item {...formAttrs.company_retirement_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_sickness_maternity_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_accident_occupational_disease_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_medical_insurance_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_voluntary_insurance_fund}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_paid_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.union_fee}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_total_paid_amount}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.company_total_paid_amount_with_union_fee}>
                <InputNumber className="full-width" />
            </Form.Item>{" "}
        </Form>
    );
}

InsuranceRecordForm.displayName = formName;
InsuranceRecordForm.formName = formName;
