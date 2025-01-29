import React, { useState, useRef, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
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
      toast.success(t("login_successful"));
      navigate("/seregela-gebeya-v2");
    } catch (err: any) {
      console.error("Error verifying OTP:", err);
      setError(t("invalid_otp"));
    } finally {
      setIsLoading(false);
    }
  };
  const handleContinueWithDefaultAccount = () => {
    const userData = {
      id: 238,
      user_name: null,
      first_name: "Simon",
      last_name: "Solomon",
      email: "SimonSolomon@mail.com",
      phone_number: "251911817119",
      email_verified_at: null,
      is_pin_updated: true,
      is_active: 1,
      wallet_balance: 349.65,
      corporate_id: 30,
      bypass_product_quantity_restriction: 1,
      bank: {
        id: 26,
        name: "No Bank",
        phone_number: "0000",
        email: "nobank@mail.com",
        deleted_at: null,
        created_at: "2023-04-11T08:57:11.000000Z",
        updated_at: "2023-04-11T08:57:11.000000Z",
        pivot: {
          user_id: 238,
          bank_id: 26,
          created_at: "2023-04-11T12:40:14.000000Z",
          updated_at: "2025-01-01T08:04:13.000000Z",
          account_number: "16",
          loan_cap: 5000,
          loan_balance: 5000,
          loan_granted: 0,
          loan_used: 15596.41,
          id: "8d3fa5d2-0252-4efb-baf8-08945dd4c04d",
        },
      },
      loan_balance: 5000,
      loan_granted: 0,
      loan_used: 15596.41,
      created_at: "2022-11-15T04:27:43.000000Z",
      deleted_at: null,
      profile_image_path: null,
      profile_thumbnail_path: null,
      address: {
        city: "AA",
        sub_city: "AA",
        woreda: "ffg",
        neighborhood: "fgg",
        house_number: "tgt",
        longitude: null,
        latitude: null,
      },
    };
    const userFirebaseToken =
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjQwZDg4ZGQ1NWQxYjAwZDg0ZWU4MWQwYjk2M2RlNGNkOGM0ZmFjM2UiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2VyZWdlbGEtZDY3MDIiLCJhdWQiOiJzZXJlZ2VsYS1kNjcwMiIsImF1dGhfdGltZSI6MTczNjIxNzc1NCwidXNlcl9pZCI6ImpObEN4OW5veXllYzh2M0hOSXNiUHpzY1Y5cDEiLCJzdWIiOiJqTmxDeDlub3l5ZWM4djNITklzYlB6c2NWOXAxIiwiaWF0IjoxNzM2MjE3NzU3LCJleHAiOjE3MzYyMjEzNTcsInBob25lX251bWJlciI6IisyNTE5MTE4MTcxMTkiLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InBob25lIjpbIisyNTE5MTE4MTcxMTkiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.Mukm8Sut5icowSbaNlMIKb8KAsAzRNi0TCP4qolmMHj4flLD5Cj85X9UCVBScXtwLvj0iUWe9Pk2xDL6F9110xTc3WvFuweRrFSTb0b-iMwumxUnnYqsVYSs_TU4ckNU483u3iuG2BrT0VTy5ew7DEtWDD-RAiH3Y-HcG452v1EeXYVoq2anxkgyRr93OYlslc3LeZ_hOf-UJ6typoZyYdPnxKfLCtaSuhqy5W1MY1HWHUyepfS9pQ-EZ7rMOq4glqGQwutirNHpSen4ku-2sWOjIdMvKGgVeguUC1klt8CDIPuoVWbE8_967kByw280b4qgNsIODfg20r_RyJdO2g";
    const userToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiNDAzMGQxZDQ5M2ZiOWYyZDczYTRkOGMxZjdhZjgyMTJmOTBjZGMxZDdlNmZkOWJkODc5NjIyY2EwNWQwNGRmMjYzOTQ5Y2ViYWRkZWE1MGUiLCJpYXQiOjE3MzYyMTc3NTguNDM3Njk1LCJuYmYiOjE3MzYyMTc3NTguNDM3Njk4LCJleHAiOjE3Njc3NTM3NTguNDMxMzkxLCJzdWIiOiIyMzgiLCJzY29wZXMiOlsiY3VzdG9tZXIiXX0.VekwooeiIz-vRie1X7ln5hKKxfe2l7QTEvTi22DPswY1-sjUfTSayndYkbgrLle_Aw7oKrVdisVkT9ef2pZCuGQEsnUFyRDbZ8CRiLgmAwFernty7sadEdcyY3_fdrxuYxfA1dwQo8GJA9IU966CjfeSmC67dA7sLvDxpS26-O94a-dHqm8Iw9j1lAjWxz5S2q4Iukj_8ElKduINkj7imuBNtUQtSYbUkA94YmdKLei9ZRBT3jP7jyOY8w0Z9oj0fX0KFiRb4kxvjcAm1F6fnCY1obf1ySMODGhxlDsgiLWZvci7I4s_yfdEvqpCRuA3zSHBNXssFMbz0KUzeqwrKog3faaGWJbXwX23xgWRgxOaKm0oTw7lmXwFQ2rdx9ESfW8qmofB-5p5ewaBgLVEO_QVCnH1KdHVFggpne1tqdTeBP89xAPVGTQWDunUyJJ0yuyGeT-o4XfZ688Vlq2ltaw7ImKi6m5NIu8tsNH5zDs8_dBt5CGHNKyyiKPab__fzj4IqKOn-TMlsv0fCD6gtWqtdtf2Ir_90X5EFUGURP_NVQDioy7vmlFDg3aVwtxZGQaos0bpkU1_S_th8248ocJAouGwFfmpRjqRqWzEWsY8lZxhsVDbINs1PUzK6axr6djNR7boTJtqpgYWDddvZkTEZwTbvNGzE6nBN9THpiQ";
    const captcha =
      "09AJNbFne1HOPg8QssG9sAm5KRo-82LYHjMnRrh-YWw5CH0UG5U9tJ7ql80LZ5AFoUbS5hr0g-J8g9-v4xqzja0Futt0uOS2tfTvWGVzpi460baCBpjSDP8dIVpizNHYwA";

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    localStorage.setItem("firebaseToken", userFirebaseToken);
    localStorage.setItem("_grecaptcha", captcha);

    toast.success("login successful");
    // @ts-expect-error: Should expect Firebase auth
    navigate(redirect);
  };
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-4 sm:px-6 lg:px-8 items-center">
      <button
        className="bg-gray-200 hover:bg-[#e9a83a] text-gray-800 font-bold py-2 px-4 rounded-full w-96 "
        onClick={handleContinueWithDefaultAccount}
      >
        continue with default account
      </button>
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
