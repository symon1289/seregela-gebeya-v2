import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store";

const PrivateRoute: React.FC = () => {
    // const { user } = useSelector((state: RootState) => state.auth);
    // @ts-expect-error user is not null
    const userData = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    // console.log('userData:', userData);
    // console.log('user from Redux:', user);

    return userData ? (
        userData.first_name === null && userData.last_name === null ? (
            <Navigate to={`/register`} replace />
        ) : (
            <Outlet />
        )
    ) : (
        <Navigate
            to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
            replace
        />
    );
};

export default PrivateRoute;
