import * as React from "react";
import { t } from "ttag";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Row, Col, Upload, Tree, Skeleton, Alert, notification } from "antd";
import { PlusOutlined, FileExcelFilled } from "@ant-design/icons";
import { useSetRecoilState } from "recoil";
import StringUtil from "util/string_util";
import EventUtil from "util/event_util";
import RequestUtil, { REQUEST_STATUS } from "util/request_util";
import EnumUtil from "util/enum_util";
import Dialog from "./dialog";
import PositionPreview from "./preview";
import MovingDialog from "./moving_dialog";
import { positionOptionSt } from "./state";
import { urls } from "./config";

// const PEM_GROUP = "Position";

export default function PositionTable() {
    const { id: companyId } = useParams();
    const [list, setList] = useState([]);
    const [item, setItem] = useState(null);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.WAITING);
    const [errMsg, setErrMsg] = useState("");

    const setPositionOption = useSetRecoilState(positionOptionSt);

    function getList() {
        EventUtil.toggleGlobalLoading(true);
        const params = companyId ? { company_id: companyId } : {};
        return RequestUtil.apiCall(urls.crud, params)
            .then((data) => {
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setList(EnumUtil.ensureReactKey(data.items));
                setPositionOption(data.extra.option);
            })
            .catch((err) => {
                setRequestStatus(REQUEST_STATUS.ERROR);
                setErrMsg(err.detail[0]);
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    }

    useEffect(() => {
        getList();
    }, []);

    function onChange(item, id) {
        if (id) {
            // move -> item === null -> set empty
            // update -> set item
            item === null ? setItem(null) : setItem(item);
        } else {
            setItem(null);
        }
        getList();
    }

    function onMove() {
        setItem({});
        getList();
    }

    const onSelect = ([id]) => {
        if (!id) return;
        EventUtil.toggleGlobalLoading();
        const params = companyId ? { company_id: companyId } : {};
        RequestUtil.apiCall(`${urls.crud}${StringUtil.ensurePk(id)}`, params)
            .then((result) => {
                setItem(result);
            })
            .finally(() => {
                EventUtil.toggleGlobalLoading(false);
            });
    };

    const uploadProps = {
        showUploadList: false,
        name: "file",
        beforeUpload: (file) => {
            const params = { file };
            if (companyId) params.company_id = companyId;
            EventUtil.toggleGlobalLoading();
            RequestUtil.apiCall(urls.upload, params, "post")
                .then(() => getList())
                .catch((err) => {
                    notification.error({
                        message: "Error",
                        description: err.detail.map((i) => <div key={i}>{i}</div>),
                        duration: 8
                    });
                })
                .finally(() => EventUtil.toggleGlobalLoading(false));
            return false;
        }
    };

    function getResult() {
        return (
            <>
                <div style={{ marginBottom: 5 }}>
                    <Upload {...uploadProps}>
                        <Button icon={<FileExcelFilled />}>Upload</Button>
                    </Upload>{" "}
                    <a
                        href="/public/sample_data/01.position.xlsx"
                        target="_blank"
                    >{t`Sample file`}</a>
                </div>
                <Row>
                    <Col span={6}>
                        <div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => Dialog.toggle()}
                            >
                                Thêm mới
                            </Button>
                        </div>
                        <Tree showLine={true} onSelect={onSelect} treeData={list} />
                    </Col>
                    <Col span={18}>
                        <PositionPreview item={item} onChange={onChange} />
                    </Col>
                </Row>
                <Dialog onChange={onChange} />
                <MovingDialog onChange={onMove} />
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

    return <div className="content">{getContent()}</div>;
}

PositionTable.displayName = "PositionTable";
