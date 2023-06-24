import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "account/employee",
        endpoints: {
            crud: "",
            inviteEmployee: "auth/invite-employee"
        }
    }
};

const urlMapInviteEmployee = {
    base: {
        prefix: "auth",
        endpoints: {
            inviteEmployee: "invite-employee"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const urlsInviteEmployee = RequestUtil.prefixMapValues(
    urlMapInviteEmployee.base
);

const headingTxt = t`Employee`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    avatar: t`Avatar`,
    name: t`Name`,
    email: t`Email`,
    mobile: t`Mobile`,
    enabled: t`Enabled`,
    group_ids: t`Groups`
};
