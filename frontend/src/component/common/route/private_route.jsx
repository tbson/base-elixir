import * as React from "react";
import { Outlet, Navigate } from "react-router-dom";
import StorageUtil from "util/storage_util";

export default function PrivateRoute() {
    return StorageUtil.getToken() ? <Outlet /> : <Navigate to="/login" />;
}

PrivateRoute.displayName = "PrivateRoute";
