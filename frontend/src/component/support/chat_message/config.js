import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "support/chat-message",
        endpoints: {
            chat: ""
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);
