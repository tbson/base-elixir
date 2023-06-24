import * as React from "react";
import DatePicker from "component/common/form/ant/date_picker";
import { DATE_REABLE_FORMAT, DATETIME_REABLE_FORMAT } from "util/date_util";

/**
 * DateInput.
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {string} props.label
 * @returns {ReactElement}
 */
export default function DateInput({ value, onChange, props = null }) {
    if (!props) {
        props = {};
    }
    const { showTime = false } = props;
    if (showTime) {
        props.showTime = {
            format: DATETIME_REABLE_FORMAT
        };
    }
    if (!showTime && !props.picker) {
        props.format = DATE_REABLE_FORMAT;
    }
    return (
        <DatePicker
            value={value}
            onChange={onChange}
            style={{ width: "100%" }}
            {...props}
        />
    );
}
