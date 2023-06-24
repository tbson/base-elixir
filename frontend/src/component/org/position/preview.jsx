import * as React from "react";
import { t } from "ttag";
import { useParams } from "react-router-dom";
import { Button, Divider } from "antd";
import { EditOutlined, DeleteOutlined, ScissorOutlined } from "@ant-design/icons";
import EventUtil from "util/event_util";
import RequestUtil from "util/request_util";
import Dialog from "./dialog";
import MovingDialog from "./moving_dialog";
import { urls, messages } from "./config";

/**
 * PositionPreview.
 *
 * @param {Object} props
 * @param {Object} props.item
 * @param {function} props.onChange - () => void
 */
export default function PositionPreview({ item, onChange }) {
    const { id: companyId } = useParams();

    const handleDelete = (id) => {
        const r = window.confirm(messages.deleteOne);
        if (!r) return;

        EventUtil.toggleGlobalLoading(true);
        const params = companyId ? { company_id: companyId } : {};
        RequestUtil.apiCall(`${urls.crud}${id}`, params, "delete")
            .then(() => {
                onChange(null);
            })
            .finally(() => EventUtil.toggleGlobalLoading(false));
    };

    if (!item || !item.uid) return null;
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <strong>{t`UID`}:</strong>&nbsp;
                        </td>
                        <td>{item.uid}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>{t`Title`}:</strong>&nbsp;
                        </td>
                        <td>{item.title}</td>
                    </tr>
                    <tr>
                        <td>
                            <strong>Số thứ tự</strong>&nbsp;
                        </td>
                        <td>{item.order}</td>
                    </tr>
                </tbody>
            </table>
            <Divider />
            <div>
                <div>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => Dialog.toggle(true, item.id, item.is_department)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(item.id)}
                    >
                        Xoá
                    </Button>
                    <Button
                        icon={<ScissorOutlined />}
                        onClick={() => MovingDialog.toggle(true, item.id)}
                    >
                        Di chuyển
                    </Button>
                </div>
            </div>
        </div>
    );
}
PositionPreview.displayName = "PositionPreview";
