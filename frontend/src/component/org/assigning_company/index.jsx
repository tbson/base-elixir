import * as React from "react";
import PageHeading from "component/common/page_heading";
import Table from "./table";
import { messages } from "./config";

export default function AssigningCompany() {
    return (
        <>
            <PageHeading>
                <>{messages.heading}</>
            </PageHeading>
            <Table />
        </>
    );
}

AssigningCompany.displayName = "AssigningCompany";
