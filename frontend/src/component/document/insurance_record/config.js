import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "document/insurance-record",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Insurance record`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    employee_id: t`Employee`,
    uid: t`Employee code`,
    name: t`Name`,
    email: t`Email`,
    phone_number: t`Phone number`,
    title: t`Title`,
    department: t`Department`,
    date: t`Month`,
    applied_salary: t`Applied salary`,
    applied_benefit: t`Applied benefit`,
    is_social_insurance_target: t`Is social insurance target`,
    employee_retirement_fund: t`Retirement fund`,
    employee_medical_insurance_fund: t`Medical insurance fund`,
    employee_voluntary_insurance_fund: t`Voluntary insurance fund`,
    employee_paid_amount: t`Employee paid amount`,
    company_retirement_fund: t`Retirement fund`,
    company_sickness_maternity_fund: t`Sickness maternity fund`,
    company_accident_occupational_disease_fund: t`Accident occupational disease fund`,
    company_medical_insurance_fund: t`Medical insurance fund`,
    company_voluntary_insurance_fund: t`Voluntary insurance fund`,
    company_paid_amount: t`Company paid amount`,
    union_fee: t`Union fee`,
    company_total_paid_amount: t`Company total paid amount`,
    company_total_paid_amount_with_union_fee: t`Company total paid amount with union fee`
};
