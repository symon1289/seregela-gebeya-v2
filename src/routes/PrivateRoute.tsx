import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PrivateRoute: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  // @ts-expect-error user is not null
  const userData = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  return userData || user ? (
    <Outlet />
  ) : (
    <Navigate
      to={`/seregela-gebeya-v2/login?redirect=${encodeURIComponent(
        location.pathname
      )}`}
      replace
    />
  );
};

export default PrivateRoute;
