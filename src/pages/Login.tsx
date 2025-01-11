import React, { useState, useRef, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// @ts-expect-error: Should expect Firebase auth
import { auth } from "../firebase";

import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState<any>(null); // Store Firebase confirmation result
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Initialize reCAPTCHA verifier
  const setUpRecaptcha = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container", // ID of the reCAPTCHA container
      {
        size: "invisible", // Use 'normal' for visible reCAPTCHA
      }
    );
    return recaptchaVerifier;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length > 0) {
      const firstDigit = value.charAt(0);
      if (firstDigit !== "9" && firstDigit !== "7") {
        setError(t("9or7"));
        return;
      }
    }

    if (value.length <= 9) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 9) {
      setError(t("9digits"));
      return;
    }

    const firstDigit = phoneNumber.charAt(0);
    if (firstDigit !== "9" && firstDigit !== "7") {
      setError(t("9or7"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recaptchaVerifier = setUpRecaptcha();
      const formattedPhoneNumber = `+251${phoneNumber}`;

      // Send OTP using Firebase
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifier
      );

      setConfirmationResult(result); // Store confirmation result
      setShowOTP(true); // Show OTP input
      toast.success(t("otp_sent")); // Notify user
    } catch (err: any) {
      console.error("Error sending OTP:", err);
      setError(t("failed_to_send_otp"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError(t("enter_all_6_digits"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Verify OTP using Firebase
      const result = await confirmationResult.confirm(otpValue);
      console.log("User signed in:", result.user);
      toast.success(t("login_successful")); // Notify user
      navigate("/"); // Redirect to home page
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(t("invalid_otp"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {showOTP ? t("enter_verification_code") : t("login_to_your_account")}
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
                    <span className="text-gray-500 sm:text-sm">+251</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="block w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e9a83a] focus:border-[#e9a83a] sm:text-sm"
                    placeholder="9/7xxxxxxxx"
                    required
                    pattern="[0-9]{9}"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length !== 9}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e9a83a] hover:bg-[#fed874] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e9a83a] disabled:opacity-50 disabled:cursor-not-allowed"
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
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md shadow-sm text-lg focus:outline-none focus:ring-[#e9a83a] focus:border-[#e9a83a]"
                      required
                    />
                  ))}
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp(["", "", "", "", "", ""]);
                    setError(null);
                  }}
                  className="mt-4 text-sm text-[#e9a83a] hover:text-[#fed874]"
                >
                  {t("change_phone_number")}
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || otp.some((digit) => digit === "")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e9a83a] hover:bg-[#fed874] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e9a83a] disabled:opacity-50 disabled:cursor-not-allowed"
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
