import * as React from "react";
import { t } from "ttag";
import { Form, Input } from "antd";
import FormUtil from "util/form_util";
import { profileUrls } from "../../config";

const formName = "UpdateAdminProfileForm";

export default function UpdateAdminProfileForm({ data, onChange }) {
    const [form] = Form.useForm();

    const formAttrs = {
        name: {
            name: "name",
            label: t`Name`,
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
                FormUtil.submit(profileUrls.profile, payload, "put")
                    .then((data) => onChange(data))
                    .catch(FormUtil.setFormErrors(form))
            }
        >
            <Form.Item {...formAttrs.name}>
                <Input autoFocus />
            </Form.Item>
        </Form>
    );
}

UpdateAdminProfileForm.displayName = formName;
UpdateAdminProfileForm.formName = formName;
