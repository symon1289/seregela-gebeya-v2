import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PrivateRoute: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  return userData || user ? (
    <Outlet />
  ) : (
    <Navigate to="/seregela-gebeya-v2/login" replace />
  );
};

export default PrivateRoute;
