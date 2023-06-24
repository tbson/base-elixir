import { format, parse, isValid } from "date-fns";

export const DATE_REABLE_FORMAT = "dd/MM/yyyy";
export const DATE_ISO_FORMAT = "yyyy-MM-dd";

export const DATETIME_REABLE_FORMAT = "dd/MM/yyyy HH:mm:ss";
export const DATEITME_ISO_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

export default class DateUtil {
    /**
     * dateFromStr.
     *
     * @param {string} strDate
     * @returns {Date}
     */
    static strToDate(strDate) {
        try {
            const result = new Date(strDate);
            return result;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    /**
     * dateStrToReadableStr.
     *
     * @param {string} strDate
     * @returns {Date}
     */
    static dateStrToReadableStr(strDate) {
        const date = DateUtil.strToDate(strDate);
        if (!date) return "";
        return format(date, DATE_REABLE_FORMAT);
    }

    /**
     * datetimeStrToReadableStr.
     *
     * @param {string} strDate
     * @returns {Date}
     */
    static datetimeStrToReadableStr(strDate) {
        const datetime = DateUtil.strToDate(strDate);
        if (!datetime) return "";
        return format(datetime, DATETIME_REABLE_FORMAT);
    }

    /**
     * formatDate.
     *
     * @param {string} strDate
     * @returns {string}
     */
    static formatDateStr(strDate) {
        if (!strDate) return strDate;
        if (strDate.includes("T")) {
            strDate = strDate.split("T")[0];
        }
        try {
            return strDate.split("-").reverse().join("/");
        } catch (_err) {
            return strDate;
        }
    }

    /**
     * isoToReadableDatetimeStr.
     *
     * @param {string} strDate
     * @returns {string}
     */
    static isoToReadableDatetimeStr(strDate) {
        if (!strDate) return strDate;
        if (!strDate.includes("T")) return strDate;
        const dateArr = strDate.split("T");
        let datePart = dateArr[0];
        let timePart = dateArr[1];
        try {
            datePart = datePart.split("-").reverse().join("/");
            return datePart + " " + timePart.replace("Z", "");
        } catch (_err) {
            return strDate;
        }
    }

    /**
     * dateStrReadableToIso.
     *
     * @param {string} dateStr
     * @returns {string}
     */
    static dateStrReadableToIso(dateStr) {
        return dateStr.split("/").reverse().join("-");
    }

    /**
     * timestampToDateTime.
     *
     * @param {number} timestamp
     * @returns {Date}
     */
    static timestampToDateTime(timestamp) {
        // ensure millisecs
        if (timestamp < 9999999999) {
            timestamp = timestamp * 1000;
        }
        return new Date(timestamp);
    }

    /**
     * timestampToStr.
     *
     * @param {number} timestamp
     * @returns {string}
     */
    static timestampToStr(timestamp) {
        const dateResult = DateUtil.timestampToDateTime(timestamp);
        return DateUtil.dateTimeToStr(dateResult);
    }

    /**
     * datetimeToStr.
     *
     * @param {Date} dateTime
     * @returns {string}
     */
    static dateTimeToStr(dateTime) {
        try {
            return format(dateTime, DATEITME_ISO_FORMAT);
        } catch (_err) {
            return "";
        }
    }

    /**
     * dateToStr.
     *
     * @param {Date} dateTime
     * @returns {string}
     */
    static dateToStr(dateTime) {
        try {
            return format(dateTime, DATE_ISO_FORMAT);
        } catch (_err) {
            console.log(_err);
            return "";
        }
    }

    /**
     * strToDateTime.
     *
     * @param {String} dateTimeStr
     * @returns {Date}
     */
    static strToDateTime(dateTimeStr) {
        const result = parse(dateTimeStr, DATEITME_ISO_FORMAT, new Date());
        return isValid(result) ? result : null;
    }

    /**
     * getCurrentTimestamps.
     *
     * @returns {String}
     */
    static getCurrentTimestamps() {
        return Date.now().toString();
    }

    /**
     * getCurrentDate.
     *
     * @returns {String}
     */
    static getCurrentDate() {
        const date = new Date();
        return date;
    }

    /**
     * getCurrentDateStripDay.
     *
     * @returns {Date}
     */
    static get1stDay(date) {
        const newDate = new Date(date.getTime());
        newDate.setDate(1);
        return newDate;
    }
}
