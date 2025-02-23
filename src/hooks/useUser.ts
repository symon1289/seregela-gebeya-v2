import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useState } from "react";
import api from "../utils/axios";
import {
    setAuth,
    setUser,
    logout,
    recoverTokenFromStorage,
} from "../store/features/authSlice";

interface UseUserReturnType {
    authState: any;
    loading: boolean;
    error: string | null;
    loginUser: (phone: string, authToken: string) => Promise<any>;
    fetchUser: () => Promise<void>;
    registerUser: (userInfo: any, phoneNumber: string) => Promise<any>;
    updateUser: (userInfo: any, phoneNumber: string) => Promise<any>;
    getNotifications: () => Promise<any>;
    handleLogout: () => Promise<void>;
    recoverSession: () => void;
}

const useUser = (): UseUserReturnType => {
    const dispatch = useDispatch<AppDispatch>();
    const authState = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Login user with phone number and Firebase token
    const loginUser = async (phone: string, authToken: string) => {
        try {
            setLoading(true);
            const res = await api.post("firebase-login", {
                phone_number: phone,
                firebase_token: authToken,
            });
            dispatch(setAuth(res.data));
            dispatch(setUser(res.data));
            setLoading(false);
            return res.data;
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Login failed");
            throw err;
        }
    };

    // Fetch user profile
    const fetchUser = async () => {
        try {
            setLoading(true);
            const res = await api.get("profile", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            dispatch(setUser(res.data));
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            setError(
                err.response?.data?.message || "Failed to fetch user data"
            );
            throw err;
        }
    };

    // Register a new user
    const registerUser = async (userInfo: any, phoneNumber: string) => {
        try {
            setLoading(true);
            const res = await api.post("register", {
                user_name: userInfo.user_name,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                phone_number: phoneNumber,
                password: userInfo.password,
                password_confirmation: userInfo.password_confirmation,
            });
            setLoading(false);
            return res.data;
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };

    // Register a new user
    const updateUser = async (userInfo: any, phoneNumber: string) => {
        try {
            setLoading(true);
            const res = await api.put(
                "profile",
                {
                    user_name: userInfo.user_name,
                    first_name: userInfo.first_name,
                    last_name: userInfo.last_name,
                    email: userInfo.email,
                    phone_number: phoneNumber,
                    password: userInfo.password,
                    password_confirmation: userInfo.password_confirmation,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );
            setLoading(false);
            return res.data;
        } catch (err: any) {
            setLoading(false);
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        }
    };
    // Get notifications for the user
    const getNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/notifications", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setLoading(false);
            return res.data.data;
        } catch (err: any) {
            setLoading(false);
            setError(
                err.response?.data?.message || "Failed to fetch notifications"
            );
            throw err;
        }
    };

    // Logout user
    const handleLogout = async () => {
        try {
            setLoading(true);
            dispatch(logout());
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            setError(err.message || "Logout failed");
            throw err;
        }
    };

    // Recover session from localStorage
    const recoverSession = () => {
        dispatch(recoverTokenFromStorage());
    };

    return {
        authState,
        loading,
        error,
        loginUser,
        fetchUser,
        registerUser,
        updateUser,
        getNotifications,
        handleLogout,
        recoverSession,
    };
};

export default useUser;
