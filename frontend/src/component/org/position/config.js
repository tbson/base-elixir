import { t } from "ttag";
import RequestUtil from "util/request_util";

const urlMap = {
    base: {
        prefix: "org/position",
        endpoints: {
            crud: "",
            upload: "upload",
            download: "download"
        }
    }
};
export const urls = RequestUtil.prefixMapValues(urlMap.base);

const headingTxt = t`Position`;
const name = headingTxt.toLowerCase();
export const messages = {
    heading: headingTxt,
    deleteOne: t`Do you want to remote this ${name}?`,
    deleteMultiple: t`Do you want to remote these ${name}?`
};

export const labels = {
    uid: t`Title/Department code`,
    title: t`Title/Department name`,
    parent_id: t`Parent department`,
    is_department: t`Is department`,
    is_head: t`Is head`,
    order: t`Order`
};
