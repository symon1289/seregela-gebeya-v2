import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserData } from "../../types/user";
// import firebase from 'firebase/app';
interface AuthState {
    user: UserData | null;
    isLoggedIn: boolean;
    phoneNumber: string;
    count: number;
    payload: Record<string, any>;
    firebaseToken: string;
    token: string;
    isAuthenticated: boolean;
    status: boolean;
    returnRoute: string;
}

const loadState = (): AuthState => {
    try {
        const user = localStorage.getItem("user");
        return {
            user: user ? JSON.parse(user) : null,
            isLoggedIn: !!localStorage.getItem("token"),
            phoneNumber: "",
            count: 0,
            payload: {},
            firebaseToken: localStorage.getItem("firebaseToken") || "",
            token: localStorage.getItem("token") || "",
            isAuthenticated: !!localStorage.getItem("token"),
            status: !!localStorage.getItem("token"),
            returnRoute: "",
        };
    } catch (error) {
        console.error("Error loading state:", error);
        return {
            user: null,
            isLoggedIn: false,
            phoneNumber: "",
            count: 0,
            payload: {},
            firebaseToken: "",
            token: "",
            isAuthenticated: false,
            status: false,
            returnRoute: "",
        };
    }
};

const initialState: AuthState = loadState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.firebaseToken = action.payload;
            localStorage.setItem("firebaseToken", action.payload);
        },
        setPayload: (state, action: PayloadAction<Record<string, any>>) => {
            state.payload = action.payload;
        },
        setAuth: (state, action: PayloadAction<any>) => {
            state.isLoggedIn = true;
            state.isAuthenticated = true;
            state.token = action.payload.access_token;
            localStorage.setItem("token", action.payload.access_token);
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.count += 1;
            state.user = action.payload.data;
            state.isLoggedIn = true;
            localStorage.setItem("user", JSON.stringify(action.payload.data));
        },
        recoverTokenFromStorage: (state) => {
            try {
                const token = localStorage.getItem("token");
                const user = localStorage.getItem("user");
                state.status = !!token;
                state.firebaseToken = token || "";
                state.user = user ? JSON.parse(user) : null;
            } catch (error) {
                console.error("Token Recovery Error:", error);
                state.status = false;
            }
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isAuthenticated = false;
            state.token = "";
            state.firebaseToken = "";
            state.status = false;

            localStorage.removeItem("token");
            localStorage.removeItem("firebaseToken");
            localStorage.removeItem("user");
        },
    },
});

export const {
    setToken,
    setPayload,
    setAuth,
    setUser,
    recoverTokenFromStorage,
    logout,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
