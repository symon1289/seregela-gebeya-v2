import React, { useRef, useState, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import bunna from "../../assets/bunna.jpg";
import useOrder from "../../hooks/useOrder";

import { OrderDetail } from "../../types/order";
import { setReceipt } from "../../store/features/orderSlice";

interface PinComponentProps {
    order: OrderDetail;
}
const PinComponent: React.FC<PinComponentProps> = ({ order }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { createOrderMutation, makePaymentWithOTPMutation } = useOrder({});
    const [pin, setPin] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOTP, setShowOTP] = useState(false);
    const [orderReturn, setOrderReturn] = useState<any>({});
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];
    const handlePinChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value !== "" && index < 5) {
            inputRefs[index + 1].current?.focus();
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
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 6) return;

        setIsLoading(true);
        setError(null);
        const preparedOrderDetail: OrderDetail = {
            ...order,
            pin_code: pin.join(""),
        };
        createOrderMutation.mutate(preparedOrderDetail, {
            onSuccess: (response) => {
                toast.success(t("success.order_placed"));
                setOrderReturn(response);
                setShowOTP(true);
                setTimeout(() => {
                    dispatch(setReceipt(response));
                }, 2000);
            },
            onError: (error: any) => {
                toast.error(
                    t("error.order_failed") +
                        " " +
                        error.response?.data?.message
                );
                console.error(
                    "Error making order:",
                    error.response?.data?.message
                );
                setError(
                    t("error.order_failed") +
                        " " +
                        error.response?.data?.message
                );
            },
        });

        setIsLoading(false);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some((digit) => digit === "")) return;

        setIsLoading(true);
        setError(null);

        makePaymentWithOTPMutation.mutate(
            {
                orderId: orderReturn.id,
                otp: otp.join(""),
            },
            {
                onSuccess: (response) => {
                    toast.success(t("success.order_placed"));
                    navigate("/seregela-gebeya-v2/profile");
                    setTimeout(() => {
                        dispatch(setReceipt(response));
                    }, 2000);
                },
                onError: (error: any) => {
                    toast.error(
                        t("error.order_failed") +
                            " " +
                            error.response?.data?.message
                    );
                    console.error(
                        "Error making order:",
                        error.response?.data?.message
                    );
                    setError(
                        t("error.order_failed") +
                            " " +
                            error.response?.data?.message
                    );
                },
            }
        );
        setIsLoading(false);
    };
    return (
        <div
            style={{
                backgroundImage: `url(${bunna})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            <div className="bg-transparent mx-auto min-h-dvh  bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 ">
                <div className=" sm:mx-auto sm:w-full sm:max-w-md flex justify-center items-center">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 justify-center items-center">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                {showOTP
                                    ? t("enter_verification_code")
                                    : t("enter_your_pin")}
                            </h2>
                        </div>
                        {!showOTP ? (
                            <form
                                className="space-y-6"
                                onSubmit={handleSendOTP}
                            >
                                <div>
                                    <label
                                        htmlFor="pin"
                                        className="block text-sm font-medium text-gray-700 b"
                                    ></label>
                                    <div className="flex gap-2 justify-between">
                                        {pin.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={inputRefs[index]}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) =>
                                                    handlePinChange(
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
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading || pin.length !== 6}
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
                            <form
                                className="space-y-6"
                                onSubmit={handleVerifyOTP}
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        {t("enter_OTP_code")} {pin}
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
            </div>
        </div>
    );
};

export default PinComponent;
