export default class EnumUtil {
    /**
     * appendKey.
     *
     * @param {Object[]} list
     * @returns {Object[]}
     */
    static ensureReactKey(list) {
        return list.map((item, index) => {
            if (item.id !== undefined) {
                item.key = item.id;
            } else {
                item.key = index;
            }
            return item;
        });
    }

    /**
     * isEmpty.
     *
     * @param {Object} obj
     * @returns {boolean}
     */
    static isEmptyObj(obj) {
        if (!obj) return true;
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
}
