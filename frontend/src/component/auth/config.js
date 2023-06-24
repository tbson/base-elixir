import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "auth/basic-auth",
        endpoints: {
            login: "login",
            resetPassword: "reset-pwd",
            changePassword: "change-pwd"
        }
    },
    staff: {
        prefix: "account/staff",
        endpoints: {
            profile: "profile"
        }
    },
    verif: {
        prefix: "noti/verif",
        endpoints: {
            check: "check",
            resend: "resend"
        }
    }
};

export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const verifUrls = RequestUtil.prefixMapValues(urlMap.verif);

const headingTxt = "Hồ sơ";
export const messages = {
    heading: headingTxt
};
