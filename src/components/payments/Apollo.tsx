import React from "react";
import { useTranslation } from "react-i18next";
import apollo from "../../assets/apollo_banner.4da5eeba.jpg";
import { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { useOrder } from "../../hooks/useOrder";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Apollo: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const receipt = useSelector((state: RootState) => state.order.receipt);
    const { useOrderDetails } = useOrder({});

    const {
        data: order,
        isLoading,
        isError,
        refetch,
    } = useOrderDetails(receipt?.id?.toString(), { enabled: false });
    if (order) {
        // or do something with the order data
    }
    const checkOrder = async () => {
        if (!receipt?.id) {
            toast.error(t("no_receipt_found"));
            return;
        }

        const { data } = await refetch();
        if (data?.invoice?.apollo_payment_transaction_no) {
            toast.success(t("payment_successfull"));
            navigate("/");
        } else {
            toast.error(t("payment_not_conducted"));
        }
    };

    if (isError) {
        toast.error(t("error_fetching_order"));
    }

    return (
        <div
            style={{
                backgroundImage: `url(${apollo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            <div className="bg-transparent mx-auto min-h-dvh  bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10">
                <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between bg-white ">
                    <div className="text-center">
                        <h3 className="text-xl sm:text-2xl leading-normal font-extrabold tracking-tight text-gray-900">
                            <span className="text-primary">
                                {t("steps_tofollow_apollo")}
                            </span>
                        </h3>
                    </div>
                    <div className="mt-4">
                        <ul className="space-y-1">
                            <li className="text-left mb-2">
                                <div className="flex flex-row items-start">
                                    <div className="flex flex-col items-center justify-center mr-5">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/30 text-quaternary hover:bg-primary hover:text-white border-primary/30 border-4 border-white text-xl font-semibold">
                                            1
                                        </div>
                                    </div>
                                    <div className=" px-5 py-2  w-full">
                                        <h4 className="text-lg leading-6 font-semibold text-gray-900">
                                            {t("enter_your_pin")}
                                        </h4>
                                        <p className="mt-2 text-base leading-6 text-gray-500">
                                            {t(
                                                "enter_your_pin_description_apollo"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="text-left mb-2">
                                <div className="flex flex-row items-start">
                                    <div className="flex flex-col items-center justify-center mr-5">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/30 text-quaternary hover:bg-primary hover:text-white border-primary/30 border-4 border-white text-xl font-semibold">
                                            2
                                        </div>
                                    </div>
                                    <div className=" px-5 py-2  w-full">
                                        <h4 className="text-lg leading-6 font-semibold text-gray-900">
                                            {t("apollo_step_two")}
                                        </h4>
                                        <p className="mt-2 text-base leading-6 text-gray-500">
                                            {t("apollo_step_two_description")}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li className="text-left mb-2">
                                <div className="flex flex-row items-start">
                                    <div className="flex flex-col items-center justify-center mr-5">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/30 text-quaternary hover:bg-primary hover:text-white border-primary/30 border-4 border-white text-xl font-semibold">
                                            3
                                        </div>
                                    </div>
                                    <div className=" px-5 py-2 w-full">
                                        <h4 className="text-lg leading-6 font-semibold text-gray-900">
                                            {t("cbe_step_three")}
                                        </h4>
                                        <p className="mt-2 text-base leading-6 text-gray-500">
                                            {t("cbe_step_three_description")}
                                        </p>
                                        <div className="mt-2 text-lg font-bold leading-6 text-gray-900 bg-gray-200 p-4 items-center text-center">
                                            {receipt?.id}
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="text-left mb-2">
                                <div className="flex flex-row items-start">
                                    <div className="flex flex-col items-center justify-center mr-5">
                                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/30 text-quaternary hover:bg-primary hover:text-white border-primary/30 border-4 border-white text-xl font-semibold">
                                            4
                                        </div>
                                    </div>
                                    <div className=" px-5 py-2  w-full">
                                        <h4 className="text-lg leading-6 font-semibold text-gray-900">
                                            {t("cbe_step_four")}
                                        </h4>
                                        <p className="mt-2 text-base leading-6 text-gray-500">
                                            {t("cbe_step_four_description")}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <div className="my-5 w-1/2 items-center justify-center text-center mx-auto">
                            <button
                                onClick={checkOrder}
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    t("finish")
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apollo;
