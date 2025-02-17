import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserData } from "../../types/user";
import {
    signInWithPhoneNumber,
    // ConfirmationResult,
    // ApplicationVerifier,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import UserAPI from "../../utils/UserAPI";
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

const initialState: AuthState = {
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

export const sendOTP = createAsyncThunk(
    "auth/sendOTP",
    async ({ phone, verify }: { phone: string; verify: any }) => {
        return await signInWithPhoneNumber(auth, phone, verify);
    }
);

export const verifyOtp = createAsyncThunk(
    "auth/verifyOtp",
    async (otp: string, { getState }) => {
        const state = getState() as { auth: AuthState };
        const confirmationResult = (window as any).confirmationResult;
        if (confirmationResult) {
            const result = await confirmationResult.confirm(otp);
            const idToken = await result.user.getIdToken(true);
            await UserAPI.userLogin(
                state.auth.payload.phone.substring(1),
                idToken
            );
            return idToken;
        }
        throw new Error("Invalid OTP");
    }
);
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
    extraReducers: (builder) => {
        builder.addCase(sendOTP.fulfilled, (state, action) => {
            (window as any).confirmationResult = action.payload;
            state.status = true;
        });
        builder.addCase(verifyOtp.fulfilled, (state, action) => {
            state.firebaseToken = action.payload;
            state.isAuthenticated = true;
        });
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
