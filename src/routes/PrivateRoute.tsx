import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PrivateRoute: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    // const userData = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    // console.log('userData:', userData);
    console.log("user from Redux:", user);

    return user !== null &&
        user !== undefined &&
        Object.keys(user).length > 0 ? (
        user.first_name === null &&
        user.last_name === null &&
        user.address === null ? (
            <Navigate
                to={`/register?redirect=${encodeURIComponent(
                    location.pathname
                )}`}
                replace
            />
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
