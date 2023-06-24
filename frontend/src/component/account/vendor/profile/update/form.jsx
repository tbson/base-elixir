import * as React from "react";
import { t } from "ttag";
import { Form, Input } from "antd";
import FormUtil from "util/form_util";
import { urls } from "../../config";

const formName = "UpdateVendorProfileForm";

export default function UpdateVendorProfileForm({ data, onChange }) {
    const [form] = Form.useForm();

    const formAttrs = {
        org_name: {
            name: "org_name",
            label: t`Organization name`,
            rules: [FormUtil.ruleRequired()]
        },
        org_uid: {
            name: "org_uid",
            label: t`Organization ID`,
            rules: [FormUtil.ruleRequired()]
        }
    };

    return (
        <Form
            form={form}
            name={formName}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ ...data }}
            onFinish={(payload) =>
                FormUtil.submit(urls.profile, payload, "put")
                    .then((data) => onChange(data))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.org_name}>
                <Input autoFocus />
            </Form.Item>
            <Form.Item {...formAttrs.org_uid}>
                <Input />
            </Form.Item>
        </Form>
    );
}

UpdateVendorProfileForm.displayName = formName;
UpdateVendorProfileForm.formName = formName;
