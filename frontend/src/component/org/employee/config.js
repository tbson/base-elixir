import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "org/employee",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Employee`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    uid: t`Employee code`,
    company_id: t`Company`,
    position_id: t`Position`,
    title_level: t`Title level`,
    first_name: t`First name`,
    last_name: t`Last name`,
    full_name: t`Full name`,
    phone_number: t`Phone number`,
    email: t`Email`,
    change_department_doc_number: t`Change department doc number`,
    change_department_doc_start_date: t`Change department doc start date`,
    change_department_doc_expiry_date: t`Change department doc expiry date`,
    change_title_doc_number: t`Change title doc number`,
    change_title_doc_start_date: t`Change title doc start date`,
    change_title_doc_expiry_date: t`Change title doc expiry date`,
    contract_type: t`Contract type`,
    contract_number: t`Contract number`,
    contract_start_date: t`Contract start date`,
    contract_expiry_date: t`Contract expiry date`,
    insurance_premiums: t`Insurance premiums`,
    insurance_start_date: t`Insurance start date`,
    insurance_expiry_date: t`Insurance expiry date`,
    labour_status: t`Labour status`,
    labour_status_start_date: t`Labour status start date`,
    labour_status_expiry_date: t`Labour status expiry date`,
    working_start_date: t`Working start date`,
    year_exp: t`Year experience`,
    gender: t`Gender`,
    birth_date: t`Birth date`,
    birth_place: t`Birth place`,
    id_card_number: t`ID card number`,
    id_card_date: t`ID card date`,
    id_card_place: t`ID card place`,
    permanent_address: t`Permanent address`,
    contact_address: t`Contact address`,
    education_level: t`Education level`,
    personal_tax_code: t`Personal tax code`,
    dependent_person: t`Dependent person`,
    insurance_code: t`Insurance code`,
    bank_name: t`Bank name`,
    bank_branch: t`Bank branch`,
    bank_account_number: t`Bank account number`
};
