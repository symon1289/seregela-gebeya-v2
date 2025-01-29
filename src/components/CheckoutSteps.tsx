import React from "react";
import { Link } from "react-router-dom";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  // step4?: boolean;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  step1,
  step2,
  step3,
  // step4
}) => {
  return (
    <div className="flex flex-col items-center border-b mx-auto bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
      <div className="mt-4 py-2 text-xs sm:mt-0 mx-auto sm:text-base">
        <div className="relative">
          <ul className="relative flex w-full items-center justify-center space-x-2 sm:space-x-4">
            {/* Step 1: Cart */}
            {step1 && (
              <li className="flex items-center space-x-3 text-left sm:space-x-4">
                <a
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-700"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </a>
                <Link
                  to="/seregela-gebeya-v2/cart"
                  className="font-semibold text-gray-900 hover:underline"
                >
                  Cart
                </Link>
              </li>
            )}

            {/* Step 2: Shipping */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <li className="flex items-center space-x-3 text-left sm:space-x-4">
              <a
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  step2
                    ? "bg-emerald-200 text-emerald-700"
                    : "bg-gray-600 text-white"
                } text-xs font-semibold`}
                href="#"
              >
                {step2 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "2"
                )}
              </a>
              {step2 ? (
                <Link
                  to="/seregela-gebeya-v2/checkout"
                  className="font-semibold text-gray-900"
                >
                  Shipping
                </Link>
              ) : (
                <span className="font-semibold text-gray-500">Shipping</span>
              )}
            </li>

            {/* Step 3: Payment */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <li className="flex items-center space-x-3 text-left sm:space-x-4">
              <a
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  step3
                    ? "bg-emerald-200 text-emerald-700"
                    : "bg-gray-400 text-white"
                } text-xs font-semibold`}
                href="#"
              >
                {step3 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  "3"
                )}
              </a>

              {step3 ? (
                <Link
                  to="/seregela-gebeya-v2/payment"
                  className="font-semibold text-gray-900"
                >
                  Payment
                </Link>
              ) : (
                <span className="font-semibold text-gray-500">Payment</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
