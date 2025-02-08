import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
// import firebase from "firebase/app";
import 'firebase/auth';
// import { AppDispatch } from "../store";

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

//important!!! for develoment only
const initialState: AuthState = {
    user: {},
    isLoggedIn: false,
    phoneNumber: '',
    count: 0,
    payload: {},
    firebaseToken: '',
    token: '',
    isAuthenticated: false,
    status: false,
    returnRoute: '',
};

// export const sendOTP = createAsyncThunk(
//   "auth/sendOTP",
//   async (val: { verify: firebase.auth.ApplicationVerifier; phone: string }, { dispatch }) => {
//     try {
//       const confirmationResult = await firebase
//         .auth()
//         .signInWithPhoneNumber(val.phone, val.verify);
//       window.confirmationResult = confirmationResult;
//       return { payload: val, smsSent: true };
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
// );

// export const verifyAccessToken = createAsyncThunk(
//   "auth/verifyAccessToken",
//   async (idToken: string, { dispatch }) => {
//     try {
//       const response = await UserAPI.userLogin(idToken);
//       dispatch(setAuth(response));
//       dispatch(setUser(response));
//       return response;
//     } catch (error) {
//       console.error(error);
//       throw error;
//     }
//   }
// );

// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async (otp: string, { dispatch }) => {
//     try {
//       const confirmationResult = window.confirmationResult;
//       if (!confirmationResult) {
//         throw new Error("No confirmation result available");
//       }

//       const result = await confirmationResult.confirm(otp);
//       const idToken = await result.user?.getIdToken();
//       if (idToken) {
//         dispatch(verifyAccessToken(idToken));
//         dispatch(setToken(idToken));
//         return { tokenPass: true, otp: true };
//       } else {
//         throw new Error("Token not retrieved");
//       }
//     } catch (error) {
//       console.error(error);
//       return { tokenPass: false, otp: false };
//     }
//   }
// );

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.firebaseToken = action.payload;
            localStorage.setItem('firebaseToken', action.payload);
        },
        setPayload: (state, action: PayloadAction<Record<string, any>>) => {
            state.payload = action.payload;
        },
        setAuth: (state, action: PayloadAction<any>) => {
            state.isLoggedIn = true;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.access_token);
        },
        setCaptcha: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            localStorage.setItem('_grecaptcha', action.payload);
        },
        setUser: (state, action: PayloadAction<any>) => {
            state.count += 1;
            state.user = action.payload.data;
            state.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(action.payload.data));
        },
        recoverTokenFromStorage: (state) => {
            try {
                const token = localStorage.getItem('token');
                const user = localStorage.getItem('user');
                state.status = !!token;
                state.firebaseToken = token || '';
                state.user = user ? JSON.parse(user) : {};
            } catch (error) {
                console.error(error);
                state.status = false;
            }
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('_grecaptcha');
            localStorage.removeItem('cart');
            localStorage.removeItem('user');
        },
    },
});

export const {
    setToken,
    setPayload,
    setAuth,
    setUser,
    setCaptcha,
    recoverTokenFromStorage,
    logout,
} = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
