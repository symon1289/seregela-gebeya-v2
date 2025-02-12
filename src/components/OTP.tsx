import { useState, useRef, KeyboardEvent,FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ConfirmationResult } from "firebase/auth";
import useUser from "../hooks/useUser";

interface OtpFormProps {
    confirmationResult: ConfirmationResult | null;
    phoneNumber: string;
    onBack: () => void;
    onSuccess: () => void;
}

const OtpForm: FC<OtpFormProps> = ({
                                             confirmationResult,
                                             phoneNumber,
                                             onBack,
                                             onSuccess,
                                         }) => {
    const { t } = useTranslation();
    const { loginUser } = useUser();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const inputRefs = [
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
        useRef<HTMLInputElement | null>(null),
    ];

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.some((digit) => digit === "")) return;
        setIsLoading(true);
        setError(null);

        try {
            if (!confirmationResult) return;
            const result = await confirmationResult.confirm(otp.join(""));
            const firebaseToken = await result.user.getIdToken();
            const formattedPhoneNumber = `251${phoneNumber}`;
            await loginUser(formattedPhoneNumber, firebaseToken);
            toast.success(t("login_successful"));
            onSuccess();
        } catch (error: any) {
            let errorMessage: string = "";
            switch (error.code) {
                case "auth/code-expired":
                    errorMessage = t("code_expired");
                    break;
                case "auth/invalid-verification-code":
                    errorMessage = t("invalid_code");
                    break;
                default:
                    errorMessage = "Failed to verify OTP";
                    break;
            }
            setError(errorMessage);
            toast.error(errorMessage);
        }
        setIsLoading(false);
    };

    return (
        <form
            onSubmit={handleVerifyOTP}
            className="px-4 py-8 space-y-6 bg-white shadow sm:rounded-lg sm:px-10"
        >
            <div>
                <label className="block mb-3 text-sm font-medium text-gray-700">
                    {t("enter_OTP_code")} {phoneNumber}
                </label>
                <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={inputRefs[index]}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-lg text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                            required
                        />
                    ))}
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-4 text-sm text-primary hover:text-secondary"
                >
                    {t("change_phone_number")}
                </button>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading || otp.some((digit) => digit === "")}
                    className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    ) : (
                        t("verify")
                    )}
                </button>
            </div>
        </form>
    );
};

export default OtpForm;