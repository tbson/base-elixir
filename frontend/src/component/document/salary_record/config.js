import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "document/salary-record",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Salary record`;
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
    working_days: t`Working days`,
    ot_days: t`OT days`,
    base_salary: t`Base salary`,
    ot_salary: t`OT salary`,
    monthly_performance_bonus: t`Monthly performance bonus`,
    quarterly_performance_bonus: t`Quarterly performance bonus`,
    annual_performance_bonus: t`Annual performance bonus`,
    sale_bonus: t`Sale bonus`,
    project_bonus: t`Project bonus`,
    bonus_notes: t`Bonus notes`,
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
    allowance_notes: t`Allowance notes`,
    gross_income: t`Gross income`,
    social_insurance: t`Social insurance`,
    personal_tax: t`Personal tax`,
    net_income: t`NET income`,
    advance_amount: t`Advance amount`,
    revert_amount: t`Revert amount`,
    advance_revert_amount_notes: t`Advance revert amount notes`,
    final_settlement_amount: t`Final settlement amount`,
    payment_date: t`Payment date`
};
