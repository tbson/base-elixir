import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "document/salary-policy",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`SalaryPolicy`;
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
    monthly_position_salary: t`Monthly position salary`,
    monthly_base_salary: t`Monthly base salary`,
    monthly_performance_bonus: t`Monthly performance bonus`,
    quarterly_performance_bonus: t`Quarterly performance bonus`,
    annual_performance_bonus: t`Annual performance bonus`,
    sale_bonus: t`Sale bonus`,
    project_bonus: t`Project bonus`,
    meal_allowance: t`Meal allowance`,
    phone_allowance: t`Phone allowance`,
    vehicle_allowance: t`Vehicle allowance`,
    housing_allowance: t`Housing allowance`,
    attraction_allowance: t`Attraction allowance`,
    seniority_allowance: t`Seniority allowance`,
    responsibility_allowance: t`Responsibility allowance`,
    concurrently_allowance: t`Concurrently allowance`,
    birth_day_allowance: t`Birth day allowance`,
    public_holiday_allowance: t`Public holiday allowance`,
    health_insurance_allowance: t`Health insurance allowance`,
    travel_allowance: t`Travel allowance`,
    gross_income: t`Gross income`
};
