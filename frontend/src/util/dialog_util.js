import { t } from "ttag";

export default class DialogUtil {
    /**
     * getDialogTitle.
     *
     * @param {number} id
     * @param {Object} messages
     * @returns {string}
     */
    static getDialogTitle(id, messages) {
        const action = id ? t`Update` : t`Add new`;
        const subject = messages.heading.toLowerCase();
        return `${action} ${subject}`;
    }
}
