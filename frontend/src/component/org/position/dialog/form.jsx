import * as React from "react";
import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Input, InputNumber } from "antd";
import { useRecoilValue } from "recoil";
import EnumUtil from "util/enum_util";
import FormUtil from "util/form_util";
import TreeInput from "component/common/form/ant/input/tree_input";
import CheckInput from "component/common/form/ant/input/check_input";
import { positionOptionSt } from "../state";
import { urls, labels } from "../config";

const formName = "PositionForm";
const emptyRecord = {
    uid: "",
    title: "",
    parent_id: null,
    is_department: false,
    is_head: false,
    order: 1
};

/**
 * @callback FormCallback
 *
 * @param {Object} data
 * @param {number} id
 */

/**
 * PositionForm.
 *
 * @param {Object} props
 * @param {Object} props.data
 * @param {FormCallback} props.onChange
 */
export default function PositionForm({ data, onChange }) {
    const { id: companyId } = useParams();
    const inputRef = useRef(null);
    const [form] = Form.useForm();
    const positionOption = useRecoilValue(positionOptionSt);
    const initialValues = EnumUtil.isEmptyObj(data) ? emptyRecord : data;
    const id = initialValues.id;

    const endPoint = id ? `${urls.crud}${id}` : urls.crud;
    const method = id ? "put" : "post";

    const formAttrs = {
        uid: {
            name: "uid",
            label: labels.uid,
            rules: [FormUtil.ruleRequired()]
        },
        title: {
            name: "title",
            label: labels.title,
            rules: [FormUtil.ruleRequired()]
        },
        parent_id: {
            name: "parent_id",
            label: labels.parent_id
        },
        is_department: {
            name: "is_department",
            label: labels.is_department
        },
        is_head: {
            name: "is_head",
            label: labels.is_head
        },
        order: {
            name: "order",
            label: labels.order
        }
    };

    useEffect(() => {
        inputRef.current.focus({ cursor: "end" });
    }, []);

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...initialValues }}
            onFinish={(payload) => {
                if (companyId) {
                    payload.company_id = companyId;
                }
                FormUtil.submit(endPoint, payload, method)
                    .then((data) => onChange(data, id))
                    .catch(FormUtil.setFormErrors(form));
            }}
        >
            <Form.Item {...formAttrs.uid}>
                <Input ref={inputRef} />
            </Form.Item>

            <Form.Item {...formAttrs.title}>
                <Input />
            </Form.Item>

            <Form.Item {...formAttrs.parent_id}>
                <TreeInput options={positionOption.dep_tree} />
            </Form.Item>

            <Form.Item {...formAttrs.is_department}>
                <CheckInput />
            </Form.Item>

            <Form.Item {...formAttrs.is_head}>
                <CheckInput />
            </Form.Item>

            <Form.Item {...formAttrs.order}>
                <InputNumber />
            </Form.Item>
        </Form>
    );
}

PositionForm.displayName = formName;
PositionForm.formName = formName;
