import * as React from "react";
import { t } from "ttag";
import { useRef, useEffect } from "react";
import { Form, Input, Divider } from "antd";
import DateUtil from "util/date_util";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import DateInput from "component/common/form/ant/input/date_input";
import { urls, labels } from "../config";

const formName = "CompanyForm";

const dateFields = ["established_date", "rep_birth_date"];

const emptyRecord = {
    ...dateFields.reduce((result, key) => ({ ...result, [key]: "" }), {})
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * CompanyForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function CompanyForm({ data, onChange }) {
    const inputRef = useRef(null);
    const [form] = Form.useForm();
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
        name: {
            name: "name",
            label: labels.name,
            rules: [FormUtil.ruleRequired()]
        },
        name_en: {
            name: "name_en",
            label: labels.name_en
        },
        name_short: {
            name: "name_short",
            label: labels.name_short
        },
        contact_address: {
            name: "contact_address",
            label: labels.contact_address,
            rules: [FormUtil.ruleRequired()]
        },
        register_address: {
            name: "register_address",
            label: labels.register_address
        },
        other_address: {
            name: "other_address",
            label: labels.other_address
        },
        tax_code: {
            name: "tax_code",
            label: labels.tax_code,
            rules: [FormUtil.ruleRequired()]
        },
        insurance_code: {
            name: "insurance_code",
            label: labels.insurance_code,
            rules: [FormUtil.ruleRequired()]
        },
        rep_name: {
            name: "rep_name",
            label: labels.rep_name,
            rules: [FormUtil.ruleRequired()]
        },
        rep_position: {
            name: "rep_position",
            label: labels.rep_position,
            rules: [FormUtil.ruleRequired()]
        },
        rep_birth_date: {
            name: "rep_birth_date",
            label: labels.rep_birth_date,
            rules: [FormUtil.ruleRequired()]
        },
        rep_id_card_number: {
            name: "rep_id_card_number",
            label: labels.rep_id_card_number,
            rules: [FormUtil.ruleRequired()]
        },
        rep_phone_number: {
            name: "rep_phone_number",
            label: labels.rep_phone_number,
            rules: [FormUtil.ruleRequired()]
        },
        rep_email: {
            name: "rep_email",
            label: labels.rep_email,
            rules: [FormUtil.ruleRequired(), FormUtil.ruleEmail()]
        },
        fax_number: {
            name: "fax_number",
            label: labels.fax_number
        },
        established_date: {
            name: "established_date",
            label: labels.established_date,
            rules: [FormUtil.ruleRequired()]
        },
        bank_name: {
            name: "bank_name",
            label: labels.bank_name,
            rules: [FormUtil.ruleRequired()]
        },
        bank_branch: {
            name: "bank_branch",
            label: labels.bank_branch
        },
        bank_account_number: {
            name: "bank_account_number",
            label: labels.bank_account_number
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
            <Divider orientation="right">{t`Company information`}</Divider>
            <Form.Item {...formAttrs.name}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.name_en}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.name_short}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.contact_address}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.register_address}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.other_address}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.fax_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.established_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.tax_code}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.insurance_code}>
                <Input />
            </Form.Item>

            <Divider orientation="right">{t`Representative information`}</Divider>
            <Form.Item {...formAttrs.rep_name}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.rep_position}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.rep_birth_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.rep_id_card_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.rep_phone_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.rep_email}>
                <Input />
            </Form.Item>

            <Divider orientation="right">{t`Bank information`}</Divider>
            <Form.Item {...formAttrs.bank_name}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.bank_branch}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.bank_account_number}>
                <Input />
            </Form.Item>
        </Form>
    );
}

CompanyForm.displayName = formName;
CompanyForm.formName = formName;
