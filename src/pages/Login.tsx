import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase/firebase";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult,
} from "firebase/auth";
import OtpForm from "../components/OTP";
import { store } from "../store/store";

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier | null;
    }
}

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOTP, setShowOTP] = useState(false);
    const [confirmationResult, setConfirmationResult] =
        useState<ConfirmationResult | null>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");
        if (value.length > 0 && !/^[97]/.test(value)) {
            setError(t("9or7"));
            return;
        }
        setPhoneNumber(value.length <= 9 ? value : phoneNumber);
        setError(null);
    };

    useEffect(() => {
        window.recaptchaVerifier = null;

        const initializeRecaptcha = () => {
            const verifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "normal",
                    callback: () => console.log("reCAPTCHA solved"),
                }
            );
            window.recaptchaVerifier = verifier;
        };

        if (!window.recaptchaVerifier) {
            initializeRecaptcha();
        }

        return () => {
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length !== 9) return;
        setIsLoading(true);
        setError(null);

        try {
            const formattedPhoneNumber = `+251${phoneNumber}`;
            if (!window.recaptchaVerifier) {
                throw new Error("reCAPTCHA not initialized");
            }

            const confirmation = await signInWithPhoneNumber(
                auth,
                formattedPhoneNumber,
                window.recaptchaVerifier
            );
            setConfirmationResult(confirmation);
            setShowOTP(true);
            toast.success("OTP sent!");
        } catch (error: any) {
            console.error("Error sending OTP:", error);
            let errorMessage: string = "";
            switch (error.code) {
                case "auth/invalid-phone-number":
                    errorMessage = t("invalid_number");
                    break;
                case "auth/too-many-requests":
                    errorMessage = t("too_many_attempts");
                    break;
                default:
                    errorMessage = "Failed to send OTP";
                    break;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
        setIsLoading(false);
    };
    const handleLoginSuccess = () => {
        // Assuming the user state gets updated after successful login
        const updatedUser = store.getState().auth.user; // Fetch the latest user state

        if (
            updatedUser &&
            updatedUser.first_name === null &&
            updatedUser.last_name === null &&
            updatedUser.address === null
        ) {
            navigate(`/register?redirect=${encodeURIComponent(redirect)}`);
        } else {
            navigate(redirect);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4 bg-gray-50 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                    {showOTP
                        ? t("enter_verification_code")
                        : t("login_to_your_account")}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
                    {!showOTP ? (
                        <form className="space-y-6" onSubmit={handleSendOTP}>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {t("phone_number")}
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">
                                            +251
                                        </span>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        className="block w-full py-2 pl-16 pr-3 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="912345678"
                                        required
                                        pattern="[0-9]{9}"
                                    />
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading || phoneNumber.length !== 9
                                    }
                                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        t("continue")
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <OtpForm
                            confirmationResult={confirmationResult}
                            phoneNumber={phoneNumber}
                            onBack={() => setShowOTP(false)}
                            onSuccess={handleLoginSuccess}
                            // onSuccess={() => navigate(redirect)}
                        />
                    )}
                </div>
            </div>

            {/* reCAPTCHA container */}
            <div
                id="recaptcha-container"
                className={showOTP ? "hidden" : "block my-2"}
            ></div>
        </div>
    );
};

export default Login;
