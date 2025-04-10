import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { RootState } from "../../store/store";
import boa from "../../assets/boa-for-payment.png";

const Boa: React.FC = () => {
    const { id } = useParams();
    const location = useLocation();
    const { t } = useTranslation();
    const receipt = useSelector((state: RootState) => state.order.receipt);

    useEffect(() => {
        window.location.href = `${window.location.origin}/payments/orders/${id}/boa${location.search}`;
    }, [id, location.search]);
    return (
        <div
            style={{
                backgroundImage: `url(${boa})`,
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
                            <span className="text-primary">{t("boa")}</span>
                        </h3>
                    </div>
                    <div className="mt-4">
                        <ul className="space-y-1">
                            <li className="text-left mb-2">
                                <div className="flex flex-row items-start">
                                    <div className=" px-5 py-2 w-full">
                                        <h4 className="text-lg leading-6 font-semibold text-gray-900">
                                            {t("redirecting")}
                                        </h4>
                                        <p className="mt-2 text-base leading-6 text-gray-500">
                                            {t("this_order_id")}
                                        </p>
                                        <div className="mt-2 bg-gray-200 text-lg font-bold leading-6 text-gray-900 p-4 items-center text-center">
                                            {receipt?.id}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Boa;
