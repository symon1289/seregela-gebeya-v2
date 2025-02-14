import { Link } from "react-router-dom";
import { t } from "i18next";
import logo from "../assets/logo.png";
import loan from "../assets/Loan.png";
import fairPrice from "../assets/fairPrice.png";
import freeDelivery from "../assets/freeDelivery.png";
import quality from "../assets/quality.png";
import contact from "../assets/24-7.png";

export default function WelcomeSection() {
    const userData = localStorage.getItem("user");
    const { first_name, last_name } = userData
        ? JSON.parse(userData)
        : { first_name: "", last_name: "" };
    return (
        <div className="bg-white shadow-lg w-full h-[400px] flex flex-col p-4 sm:p-6">
            <div className="text-center mb-1">
                <img
                    src={logo}
                    alt="seregela gebeya logo"
                    className="w-20 h-10 sm:w-12 sm:h-12 mx-auto text-[#e7a334] mb-2 aspect-[720/555] object-contain"
                />
                <h2 className="text-[14px] lg:text-lg font-semibold mb-1">
                    {t("welcome")}
                </h2>
                <div className="flex gap-2 mb-4 lg:mb-1">
                    {userData ? (
                        <Link
                            to="/seregela-gebeya-v2/profile"
                            className="w-full"
                        >
                            <button className="w-full bg-[#e7a334] text-white py-2 px-4 rounded hover:bg-white hover:text-[#e7a334] border border-[#e7a334] transition-colors duration-300 text-[12px] lg:text-base">
                                {t("hello")} {first_name} {last_name}
                            </button>
                        </Link>
                    ) : (
                        <Link to="/seregela-gebeya-v2/login" className="w-full">
                            <button className="w-full bg-[#e7a334] text-white py-2 px-4 rounded hover:bg-white  hover:text-[#e7a334] border border-[#e7a334] transition-colors duration-300 text-[12px] lg:text-base  ">
                                {t("register_now")}
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            <div className="flex-grow space-y-3">
                {[
                    {
                        Icon: fairPrice,

                        title: t("fair_price"),
                        description: t("large_number_of_items_in_cheap_price"),
                    },
                    {
                        Icon: loan,

                        title: t("loan_service"),
                        description: t("you_can_buy_in_debt"),
                    },
                    {
                        Icon: freeDelivery,

                        title: t("free_transport"),
                        description: t("free_delivery_in_your_place"),
                    },
                    {
                        Icon: quality,

                        title: t("large_number_of_items"),
                        description: t("quality_product_in_low_price"),
                    },
                    {
                        Icon: contact,

                        title: t("customer_service"),
                        description: t("guaranted_service_24_7"),
                    },
                ].map(({ Icon, title, description }, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 transform transition-transform duration-300 hover:translate-x-1"
                    >
                        <img
                            src={Icon}
                            className={`w-5 h-5 sm:w-6 sm:h-6  flex-shrink-0`}
                            alt={title}
                        />
                        <div>
                            <h3 className="font-medium text-[10px] md:text-xs lg:text-sm ">
                                {title}
                            </h3>
                            <p className="text-[8px] md:text-[10px]  text-gray-600 line-clamp-1">
                                {description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
