export default class StringUtil {
    static snakeToCamel(str) {
        return str
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) =>
                group.toUpperCase().replace("-", "").replace("_", "")
            );
    }

    /**
     * ensurePk.
     *
     * @param {string | number} rawPk
     * @returns {number}
     */
    static ensurePk(rawPk) {
        rawPk = String(rawPk);
        if (rawPk.includes("_")) {
            return parseInt(rawPk.split("_")[1]);
        }
        return parseInt(rawPk);
    }
}
