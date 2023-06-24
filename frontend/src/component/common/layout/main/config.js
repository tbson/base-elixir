import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "auth/basic-auth",
        endpoints: {
            logout: "logout"
        }
    },
    fbPage: {
        prefix: "platform/fb-page",
        endpoints: {
            crud: ""
        }
    }
};

export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const fbPageUrls = RequestUtil.prefixMapValues(urlMap.fbPage);
