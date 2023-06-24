import * as React from "react";
import { TreeSelect } from "antd";

/**
 * TreeInput.
 *
 * @param {Object} props
 * @param {string} props.value
 * @param {onChange} props.onChange
 * @returns {ReactElement}
 */
export default function TreeInput({ value, options, onChange }) {
    return (
        <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={value}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Please select"
            allowClear
            treeDefaultExpandAll
            onChange={onChange}
            treeData={options}
        />
    );
}
