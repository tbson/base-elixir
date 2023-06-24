import StorageUtil from "util/storage_util";

export default class PemUtil {
    static hasPermit(pem_group, pem = "list") {
        try {
            const permissions = StorageUtil.getPems();
            return permissions[pem_group].includes(pem);
        } catch (_e) {
            return false;
        }
    }

    static canView(pem_groups) {
        try {
            if (typeof pem_groups === "string") {
                pem_groups = [pem_groups];
            }
            const permissions = StorageUtil.getPems();
            for (const pem_group of pem_groups) {
                if (permissions[pem_group].includes("list")) {
                    return true;
                }
            }
            return false;
        } catch (_e) {
            return false;
        }
    }
}
