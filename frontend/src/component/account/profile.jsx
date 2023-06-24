import * as React from "react";
import StorageUtil from "util/storage_util";
import AdminProfile from "component/account/admin/profile";
import StaffProfile from "component/account/staff/profile";
import DirectorProfile from "component/account/director/profile";
import AssistantProfile from "component/account/assistant/profile";
import { PROFILE_TYPE } from "src/consts";

export default function Profile() {
    switch (StorageUtil.getProfileType()) {
        case PROFILE_TYPE.staff:
            return <StaffProfile />;
        case PROFILE_TYPE.director:
            return <DirectorProfile />;
        case PROFILE_TYPE.assistant:
            return <AssistantProfile />;
        default:
            return <AdminProfile />;
    }
}

Profile.displayName = "Profile";
