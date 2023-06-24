import * as React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Form } from "antd";
import FormUtil from "util/form_util";
import TreeInput from "component/common/form/ant/input/tree_input";
import { urls } from "../config";
import { positionOptionSt } from "../state";

const formName = "PositionMovingForm";

/**
 * PositionMovingForm.
 *
 * @param {Object} props
 * @param {number} props.id
 * @param {function} props.onChange
 * @param {Object} props.formRef
 */
export default function PositionMovingForm({ id, onChange }) {
    const { id: companyId } = useParams();
    const [form] = Form.useForm();
    const options = useRecoilValue(positionOptionSt);

    const formAttrs = {
        parent_id: {
            name: "parent_id",
            label: "Phòng ban",
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ parent: id }}
            onFinish={(payload) => {
                if (companyId) {
                    payload.company_id = companyId;
                }
                FormUtil.submit(`${urls.crud}${id}`, payload, "put")
                    .then(() => onChange())
                    .catch(FormUtil.setFormErrors(form));
            }}
        >
            <Form.Item {...formAttrs.parent_id}>
                <TreeInput options={options.dep_tree} level="department" />
            </Form.Item>
        </Form>
    );
}

PositionMovingForm.displayName = formName;
PositionMovingForm.formName = formName;
