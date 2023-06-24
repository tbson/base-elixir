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
import { employeeOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "EmployeeForm";

const dateFields = [
    "change_department_doc_start_date",
    "change_department_doc_expiry_date",
    "change_title_doc_start_date",
    "change_title_doc_expiry_date",
    "contract_start_date",
    "contract_expiry_date",
    "insurance_start_date",
    "insurance_expiry_date",
    "labour_status_start_date",
    "labour_status_expiry_date",
    "working_start_date",
    "birth_date",
    "id_card_date"
];

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
 * EmployeeForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function EmployeeForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const employeeOption = useRecoilValue(employeeOptionSt);
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
        uid: {
            name: "uid",
            label: labels.uid,
            rules: [FormUtil.ruleRequired()]
        },
        position_id: {
            name: "position_id",
            label: labels.position_id,
            rules: [FormUtil.ruleRequired()]
        },
        title_level: {
            name: "title_level",
            label: labels.title_level
        },
        first_name: {
            name: "first_name",
            label: labels.first_name,
            rules: [FormUtil.ruleRequired()]
        },
        last_name: {
            name: "last_name",
            label: labels.last_name,
            rules: [FormUtil.ruleRequired()]
        },
        phone_number: {
            name: "phone_number",
            label: labels.phone_number,
            rules: [FormUtil.ruleRequired()]
        },
        email: {
            name: "email",
            label: labels.email,
            rules: [FormUtil.ruleRequired(), FormUtil.ruleEmail()]
        },
        change_department_doc_number: {
            name: "change_department_doc_number",
            label: labels.change_department_doc_number
        },
        change_department_doc_start_date: {
            name: "change_department_doc_start_date",
            label: labels.change_department_doc_start_date
        },
        change_department_doc_expiry_date: {
            name: "change_department_doc_expiry_date",
            label: labels.change_department_doc_expiry_date
        },
        change_title_doc_number: {
            name: "change_title_doc_number",
            label: labels.change_title_doc_number
        },
        change_title_doc_start_date: {
            name: "change_title_doc_start_date",
            label: labels.change_title_doc_start_date
        },
        change_title_doc_expiry_date: {
            name: "change_title_doc_expiry_date",
            label: labels.change_title_doc_expiry_date
        },
        contract_type: {
            name: "contract_type",
            label: labels.contract_type,
            rules: [FormUtil.ruleRequired()]
        },
        contract_number: {
            name: "contract_number",
            label: labels.contract_number
        },
        contract_start_date: {
            name: "contract_start_date",
            label: labels.contract_start_date
        },
        contract_expiry_date: {
            name: "contract_expiry_date",
            label: labels.contract_expiry_date
        },
        insurance_premiums: {
            name: "insurance_premiums",
            label: labels.insurance_premiums,
            rules: [FormUtil.ruleRequired()]
        },
        insurance_start_date: {
            name: "insurance_start_date",
            label: labels.insurance_start_date
        },
        insurance_expiry_date: {
            name: "insurance_expiry_date",
            label: labels.insurance_expiry_date
        },
        labour_status: {
            name: "labour_status",
            label: labels.labour_status,
            rules: [FormUtil.ruleRequired()]
        },
        labour_status_start_date: {
            name: "labour_status_start_date",
            label: labels.labour_status_start_date,
            rules: [FormUtil.ruleRequired()]
        },
        labour_status_expiry_date: {
            name: "labour_status_expiry_date",
            label: labels.labour_status_expiry_date
        },
        working_start_date: {
            name: "working_start_date",
            label: labels.working_start_date
        },
        year_exp: {
            name: "year_exp",
            label: labels.year_exp
        },
        gender: {
            name: "gender",
            label: labels.gender,
            rules: [FormUtil.ruleRequired()]
        },
        birth_date: {
            name: "birth_date",
            label: labels.birth_date,
            rules: [FormUtil.ruleRequired()]
        },
        birth_place: {
            name: "birth_place",
            label: labels.birth_place,
            rules: [FormUtil.ruleRequired()]
        },
        id_card_number: {
            name: "id_card_number",
            label: labels.id_card_number,
            rules: [FormUtil.ruleRequired()]
        },
        id_card_date: {
            name: "id_card_date",
            label: labels.id_card_date,
            rules: [FormUtil.ruleRequired()]
        },
        id_card_place: {
            name: "id_card_place",
            label: labels.id_card_place,
            rules: [FormUtil.ruleRequired()]
        },
        permanent_address: {
            name: "permanent_address",
            label: labels.permanent_address,
            rules: [FormUtil.ruleRequired()]
        },
        contact_address: {
            name: "contact_address",
            label: labels.contact_address,
            rules: [FormUtil.ruleRequired()]
        },
        education_level: {
            name: "education_level",
            label: labels.education_level,
            rules: [FormUtil.ruleRequired()]
        },
        personal_tax_code: {
            name: "personal_tax_code",
            label: labels.personal_tax_code,
            rules: [FormUtil.ruleRequired()]
        },
        dependent_person: {
            name: "dependent_person",
            label: labels.dependent_person,
            rules: [FormUtil.ruleRequired()]
        },
        insurance_code: {
            name: "insurance_code",
            label: labels.insurance_code,
            rules: [FormUtil.ruleRequired()]
        },
        bank_name: {
            name: "bank_name",
            label: labels.bank_name,
            rules: [FormUtil.ruleRequired()]
        },
        bank_branch: {
            name: "bank_branch",
            label: labels.bank_branch,
            rules: [FormUtil.ruleRequired()]
        },
        bank_account_number: {
            name: "bank_account_number",
            label: labels.bank_account_number,
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
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
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
            <Form.Item {...formAttrs.uid}>
                <Input ref={inputRef} />
            </Form.Item>

            <Divider orientation="right">{t`Position section`}</Divider>

            <Form.Item {...formAttrs.position_id}>
                <TreeInput options={employeeOption.position.originalOptions} />
            </Form.Item>

            <Form.Item {...formAttrs.title_level}>
                <Input />
            </Form.Item>

            <Divider orientation="right">{t`Personal information section`}</Divider>

            <Form.Item {...formAttrs.first_name}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.last_name}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.phone_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.email}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.gender}>
                <SelectInput options={employeeOption.gender.selectOptions} block />
            </Form.Item>

            <Form.Item {...formAttrs.birth_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.birth_place}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.id_card_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.id_card_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.id_card_place}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.permanent_address}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.contact_address}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.education_level}>
                <SelectInput
                    options={employeeOption.educationLevel.selectOptions}
                    block
                />
            </Form.Item>

            <Form.Item {...formAttrs.personal_tax_code}>
                <Input />
            </Form.Item>

            <Divider orientation="right">{t`Change deparment section`}</Divider>

            <Form.Item {...formAttrs.change_department_doc_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.change_department_doc_start_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.change_department_doc_expiry_date}>
                <DateInput />
            </Form.Item>

            <Divider orientation="right">{t`Contract section`}</Divider>

            <Form.Item {...formAttrs.contract_type}>
                <SelectInput
                    options={employeeOption.contractType.selectOptions}
                    block
                />
            </Form.Item>

            <Form.Item {...formAttrs.contract_number}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.contract_start_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.contract_expiry_date}>
                <DateInput />
            </Form.Item>

            <Divider orientation="right">{t`Insurance section`}</Divider>

            <Form.Item {...formAttrs.insurance_code}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.insurance_premiums}>
                <InputNumber />
            </Form.Item>

            <Form.Item {...formAttrs.insurance_start_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.insurance_expiry_date}>
                <DateInput />
            </Form.Item>

            <Divider orientation="right">{t`Labour section`}</Divider>

            <Form.Item {...formAttrs.labour_status}>
                <SelectInput
                    options={employeeOption.labourStatus.selectOptions}
                    block
                />
            </Form.Item>

            <Form.Item {...formAttrs.labour_status_start_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.labour_status_expiry_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.working_start_date}>
                <DateInput />
            </Form.Item>

            <Form.Item {...formAttrs.year_exp}>
                <InputNumber />
            </Form.Item>

            <Divider orientation="right">{t`Bank section`}</Divider>

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

EmployeeForm.displayName = formName;
EmployeeForm.formName = formName;
