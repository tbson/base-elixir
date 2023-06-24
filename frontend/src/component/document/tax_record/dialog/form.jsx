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
import { taxRecordOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "TaxRecordForm";

const dateFields = ["date"];

const emptyRecord = {
    monthly_income: 0,
    pretax_income: 0,
    personal_allowance: 0,
    family_allowance_members: 0,
    family_allowance: 0,
    deducted_income: 0,
    taxable_income: 0,
    tax_rate: 0,
    personal_income_tax: 0,
    ...dateFields.reduce((result, key) => ({ ...result, [key]: "" }), {})
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * TaxRecordForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function TaxRecordForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const taxRecordOption = useRecoilValue(taxRecordOptionSt);
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
        monthly_income: {
            name: "monthly_income",
            label: labels.monthly_income
        },
        pretax_income: {
            name: "pretax_income",
            label: labels.pretax_income
        },
        personal_allowance: {
            name: "personal_allowance",
            label: labels.personal_allowance
        },
        family_allowance_members: {
            name: "family_allowance_members",
            label: labels.family_allowance_members
        },
        family_allowance: {
            name: "family_allowance",
            label: labels.family_allowance
        },
        deducted_income: {
            name: "deducted_income",
            label: labels.deducted_income
        },
        taxable_income: {
            name: "taxable_income",
            label: labels.taxable_income
        },
        tax_rate: {
            name: "tax_rate",
            label: labels.tax_rate
        },
        personal_income_tax: {
            name: "personal_income_tax",
            label: labels.personal_income_tax
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
                <SelectInput options={taxRecordOption.employee.selectOptions} block />
            </Form.Item>
            <Form.Item {...formAttrs.date}>
                <DateInput props={{ picker: "month" }} className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.monthly_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.pretax_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.personal_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.family_allowance_members}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.family_allowance}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.deducted_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.taxable_income}>
                <InputNumber className="full-width" />
            </Form.Item>
            <Form.Item {...formAttrs.tax_rate}>
                <InputNumber className="full-width" addonAfter="%" />
            </Form.Item>
            <Form.Item {...formAttrs.personal_income_tax}>
                <InputNumber className="full-width" />
            </Form.Item>{" "}
        </Form>
    );
}

TaxRecordForm.displayName = formName;
TaxRecordForm.formName = formName;
