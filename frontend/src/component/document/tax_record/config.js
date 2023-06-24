import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "document/tax-record",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Tax record`;
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
    monthly_income: t`Monthly income`,
    pretax_income: t`Pretax income`,
    personal_allowance: t`Personal allowance`,
    family_allowance_members: t`Family allowance members`,
    family_allowance: t`Family allowance`,
    deducted_income: t`Deducted income`,
    taxable_income: t`Taxable income`,
    tax_rate: t`Tax rate`,
    personal_income_tax: t`Personal income tax`
};
