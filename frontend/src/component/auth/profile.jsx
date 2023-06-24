import * as React from "react";
import StorageUtil from "util/storage_util";
import StaffProfile from "component/staff/profile";
export default function Profile() {
    const userType = StorageUtil.getUserType();
    if (userType === "staff") {
        return <StaffProfile />;
    }
    return null;
}

Profile.displayName = "Profile";
