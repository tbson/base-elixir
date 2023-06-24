import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "account",
        endpoints: {
            profile: "employee-profile"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Employee`;
export const messages = {
    heading: headingTxt
};
