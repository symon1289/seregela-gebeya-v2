import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
    signInWithPhoneNumber,
    // ConfirmationResult,
    // ApplicationVerifier,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import UserAPI from "../../utils/UserAPI";
// import firebase from 'firebase/app';
interface AuthState {
    user: Record<string, any> | null;
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

// declare global {
//     interface Window {
//         confirmationResult?: ConfirmationResult;
//     }
// }

// // ✅ Send OTP via Firebase Auth
// export const sendOTP = createAsyncThunk<
//     { "sms-sent": boolean },
//     { verify: ApplicationVerifier; phone: string }
// >("auth/sendOTP", async ({ verify, phone }, { dispatch, rejectWithValue }) => {
//     try {
//         const confirmationResult = await signInWithPhoneNumber(
//             auth,
//             phone,
//             verify
//         );
//         window.confirmationResult = confirmationResult;
//         dispatch(setPayload({ phone }));
//         return { "sms-sent": true };
//     } catch (error) {
//         console.error("Error sending OTP:", error);
//         return rejectWithValue("Failed to send OTP. Please try again.");
//     }
// });

// // ✅ Verify OTP & Authenticate User
// export const verifyOtp = createAsyncThunk<
//     { tokenPass: boolean; otp: boolean },
//     string
// >("auth/verifyOtp", async (otp, { dispatch, rejectWithValue }) => {
//     try {
//         if (!window.confirmationResult) {
//             return rejectWithValue("OTP confirmation not found. Please retry.");
//         }

//         const result = await window.confirmationResult.confirm(otp);
//         const idToken = await result.user.getIdToken();

//         if (!idToken) throw new Error("Failed to retrieve token");

//         dispatch(verifyAccessToken(idToken));
//         dispatch(setToken(idToken));
//         return { tokenPass: true, otp: true };
//     } catch (error) {
//         console.error("OTP Verification Failed:", error);
//         return rejectWithValue("Invalid OTP. Please try again.");
//     }
// });

// // ✅ Verify Access Token with Backend
// export const verifyAccessToken = createAsyncThunk<any, string>(
//     "auth/verifyAccessToken",
//     async (idToken, { dispatch, getState, rejectWithValue }) => {
//         try {
//             const state = getState() as RootState;
//             const phoneNumber = state.auth.payload?.phone || "";

//             const response = await UserAPI.userLogin(phoneNumber, idToken);
//             dispatch(setAuth(response));
//             dispatch(setUser(response));

//             return response;
//         } catch (error) {
//             console.error("Token Verification Error:", error);
//             return rejectWithValue("Failed to verify access token.");
//         }
//     }
// );

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
