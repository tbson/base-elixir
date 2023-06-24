import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "account/admin",
        endpoints: {
            crud: ""
        }
    },
    profile: {
        prefix: "profile",
        endpoints: {
            profile: "admin"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const profileUrls = RequestUtil.prefixMapValues(urlMap.profile);

const headingTxt = t`Admin`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    name: t`Name`,
    email: t`Email`,
    mobile: t`Mobile`,
    pwd: t`Password`
};
