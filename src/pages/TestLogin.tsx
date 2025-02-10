import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { auth, RecaptchaVerifier } from "../firebase/firebase";
import { useDispatch } from "react-redux";
import useUser from "../hooks/useUser";
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get("redirect") || "/home";

    const { sendOtp, verifyOtpCode } = useUser();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [appVerifier, setAppVerifier] = useState<any>(null);

    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    useEffect(() => {
        initReCaptcha();
    }, []);

    const initReCaptcha = () => {
        setTimeout(() => {
            const verifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "normal",
                    callback: () => {},
                    "expired-callback": () => {},
                }
            );
            setAppVerifier(verifier);
        }, 500);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "");

        if (value.length > 0 && !/^[97]/.test(value)) {
            setError(t("9or7"));
            return;
        }

        setPhoneNumber(value.length <= 9 ? value : phoneNumber);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            phoneNumber.length >= 9 &&
            (phoneNumber.charAt(0) === "9" || phoneNumber.charAt(0) === "7")
        ) {
            setIsLoading(true);
            try {
                // @ts-expect-error expected
                await dispatch(sendOtp({phone: `+251${phoneNumber}`,verify: appVerifier,})
                );
                setShowOTP(true);
                toast.success("OTP sent!");
            } catch (error) {
                setError("Failed to send OTP");
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setError("Invalid phone number");
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (
        index: number,
        e: KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            //@ts-expect-error  sssss
            await dispatch(verifyOtpCode(otp)).unwrap();
            toast.success("OTP verified!");
            navigate(redirect);
        } catch (error) {
            setError("Invalid OTP");
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-4 sm:px-6 lg:px-8 items-center">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {showOTP
                        ? t("enter_verification_code")
                        : t("login_to_your_account")}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {!showOTP ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    {t("phone_number")}
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
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
                                        className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="9/7xxxxxxxx"
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
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        t("continue")
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerifyOTP}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    {t("enter_OTP_code")} {phoneNumber}
                                </label>
                                <div className="flex gap-2 justify-between">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={inputRefs[index]}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            onKeyDown={(e) =>
                                                handleKeyDown(index, e)
                                            }
                                            className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-primary focus:border-primary"
                                            required
                                        />
                                    ))}
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowOTP(false);
                                        setOtp(["", "", "", "", "", ""]);
                                        setError(null);
                                    }}
                                    className="mt-4 text-sm text-primary hover:text-secondary"
                                >
                                    {t("change_phone_number")}
                                </button>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={
                                        isLoading ||
                                        otp.some((digit) => digit === "")
                                    }
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        t("verify")
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default Login;
