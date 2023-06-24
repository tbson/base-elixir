import StringUtil from "util/string_util";

export default class OptionUtil {
    static getFilterOptions(options) {
        return options.map((i) => ({
            value: String(i.value),
            text: i.label
        }));
    }

    static getTransferOptions(options) {
        return options.map((i) => ({
            key: String(i.value),
            title: i.label,
            description: ""
        }));
    }

    static getMapOptions(options) {
        return options.reduce((acc, i) => {
            acc[i.value] = i.label;
            return acc;
        }, {});
    }

    static getAllOptions(option) {
        const entries = Object.entries(option).map(([key, value]) => [
            StringUtil.snakeToCamel(key),
            {
                selectOptions: value,
                transferOptions: OptionUtil.getTransferOptions(value),
                filterOptions: OptionUtil.getFilterOptions(value),
                mapOptions: OptionUtil.getMapOptions(value),
                originalOptions: value
            }
        ]);
        return Object.fromEntries(entries);
    }
}
