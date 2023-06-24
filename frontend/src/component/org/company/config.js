import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "org/company",
        endpoints: {
            crud: "",
            activate: "activate",
            assign: "assign"
        }
    },
    director: {
        prefix: "account/director",
        endpoints: {
            crud: ""
        }
    },
    assistant: {
        prefix: "account/assistant",
        endpoints: {
            crud: ""
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const directorUrls = RequestUtil.prefixMapValues(urlMap.director);
export const assistantUrls = RequestUtil.prefixMapValues(urlMap.assistant);

const headingTxt = t`Company`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    uid: t`Code`,
    name: t`Name`,
    name_en: t`English name`,
    name_short: t`Short name`,
    contact_address: t`Contact address`,
    register_address: t`Register address`,
    other_address: t`Other address`,

    fax_number: t`Fax number`,
    established_date: t`Establish date`,
    tax_code: t`Tax code`,
    insurance_code: t`Insurance code`,

    rep_name: t`Rep name`,
    rep_position: t`Rep position`,
    rep_birth_date: t`Rep birth date`,
    rep_id_card_number: t`Rep ID card number`,
    rep_phone_number: t`Rep phone number`,
    rep_email: t`Rep email`,

    bank_name: t`Bank name`,
    bank_branch: t`Bank branch`,
    bank_account_number: t`Bank account number`,

    staff: t`Staff`,
    activated_at: t`Activated at`,

    manager: {
        name: t`Name`,
        email: t`Email`,
        mobile: t`Mobile`,
        pwd: t`Password`
    }
};
