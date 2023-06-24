import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Skeleton, Alert } from "antd";
import PageHeading from "component/common/page_heading";
import RequestUtil, { REQUEST_STATUS } from "util/request_util";
import EventUtil from "util/event_util";
import EnumUtil from "util/enum_util";
import { AddNewBtn, EditBtn } from "component/common/table/button";
import DirectorDialog from "./director_dialog";
import AssistantDialog from "./assistant_dialog";
import CompanyDialog from "./dialog";
import { urls, labels } from "./config";

export default function CompanyDetail() {
    const { id } = useParams();
    const [item, setItem] = useState({});
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.WAITING);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        getDetail(id);
    }, [id]);

    function getDetail(id) {
        EventUtil.toggleGlobalLoading(true);
        return RequestUtil.apiCall(`${urls.crud}${id}`)
            .then((data) => {
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setItem(data);
            })
            .catch((err) => {
                setRequestStatus(REQUEST_STATUS.ERROR);
                setErrMsg(err.detail[0]);
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    }

    function getResult() {
        return (
            <>
                <Row gutter={[5, 5]}>
                    <Col span={12}>
                        <table className="styled-table">
                            <tbody>
                                <tr>
                                    <td colSpan={2}>
                                        <strong>{t`Company info`.toUpperCase()}</strong>
                                        <EditBtn
                                            className="float-right"
                                            onClick={() => {
                                                CompanyDialog.toggle(true, item.id);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.uid}</strong>
                                    </td>
                                    <td>{item.uid}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.name}</strong>
                                    </td>
                                    <td>{item.name}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.name_en}</strong>
                                    </td>
                                    <td>{item.name_en}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.name_short}</strong>
                                    </td>
                                    <td>{item.name_short}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.contact_address}</strong>
                                    </td>
                                    <td>{item.contact_address}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.register_address}</strong>
                                    </td>
                                    <td>{item.register_address}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.other_address}</strong>
                                    </td>
                                    <td>{item.other_address}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.fax_number}</strong>
                                    </td>
                                    <td>{item.fax_number}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.established_date}</strong>
                                    </td>
                                    <td>{item.established_date}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.tax_code}</strong>
                                    </td>
                                    <td>{item.tax_code}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.insurance_code}</strong>
                                    </td>
                                    <td>{item.insurance_code}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_name}</strong>
                                    </td>
                                    <td>{item.rep_name}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_position}</strong>
                                    </td>
                                    <td>{item.rep_position}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_birth_date}</strong>
                                    </td>
                                    <td>{item.rep_birth_date}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_id_card_number}</strong>
                                    </td>
                                    <td>{item.rep_id_card_number}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_phone_number}</strong>
                                    </td>
                                    <td>{item.rep_phone_number}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.rep_email}</strong>
                                    </td>
                                    <td>{item.rep_email}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.bank_name}</strong>
                                    </td>
                                    <td>{item.bank_name}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.bank_branch}</strong>
                                    </td>
                                    <td>{item.bank_branch}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.bank_account_number}</strong>
                                    </td>
                                    <td>{item.bank_account_number}</td>
                                </tr>
                                <tr>
                                    <td>
                                        <strong>{labels.activated_at}</strong>
                                    </td>
                                    <td>{item.activated_at}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col span={12}>
                        <div>
                            {EnumUtil.isEmptyObj(item.director) ? (
                                <AddNewBtn
                                    label={t`Create director`}
                                    onClick={() => {
                                        DirectorDialog.toggle();
                                    }}
                                />
                            ) : (
                                <table className="styled-table">
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <strong>
                                                    {t`Director info`.toUpperCase()}
                                                </strong>
                                                <EditBtn
                                                    className="float-right"
                                                    onClick={() => {
                                                        DirectorDialog.toggle(
                                                            true,
                                                            item.director.id
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Name`}</strong>
                                            </td>
                                            <td>{item.director.name}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Email`}</strong>
                                            </td>
                                            <td>{item.director.email}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Mobile`}</strong>
                                            </td>
                                            <td>{item.director.mobile}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="mg-top-5">
                            {EnumUtil.isEmptyObj(item.assistant) ? (
                                <AddNewBtn
                                    label={t`Create assistant`}
                                    onClick={() => {
                                        AssistantDialog.toggle();
                                    }}
                                />
                            ) : (
                                <table className="styled-table">
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <strong>
                                                    {t`Assistant info`.toUpperCase()}
                                                </strong>
                                                <EditBtn
                                                    className="float-right"
                                                    onClick={() => {
                                                        AssistantDialog.toggle(
                                                            true,
                                                            item.assistant.id
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Name`}</strong>
                                            </td>
                                            <td>{item.assistant.name}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Email`}</strong>
                                            </td>
                                            <td>{item.assistant.email}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>{t`Mobile`}</strong>
                                            </td>
                                            <td>{item.assistant.mobile}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Col>
                </Row>

                <DirectorDialog
                    onChange={(data) => {
                        const newItem = { ...item, director: data };
                        setItem(newItem);
                    }}
                />
                <AssistantDialog
                    onChange={(data) => {
                        const newItem = { ...item, assistant: data };
                        setItem(newItem);
                    }}
                />

                <CompanyDialog onChange={(data, _id) => setItem(data)} />
            </>
        );
    }

    function getError() {
        return <Alert message={errMsg} type="error" />;
    }

    function getWaiting() {
        return <Skeleton active />;
    }

    function getContent() {
        if (requestStatus === REQUEST_STATUS.SUCCESS) {
            return getResult();
        } else if (requestStatus === REQUEST_STATUS.WAITING) {
            return getWaiting();
        } else {
            return getError();
        }
    }

    return (
        <>
            <PageHeading>
                <>{item.name}</>
            </PageHeading>
            <div className="content">{getContent()}</div>
        </>
    );
}

CompanyDetail.displayName = "CompanyDetail";
