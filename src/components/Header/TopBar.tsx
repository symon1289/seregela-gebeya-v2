import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../store/features/languageSlice";
import { FaTruckFast } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
// import freeDelivery from "../../assets/image_2024-11-08_17-21-35.png";
export default function TopBar() {
    const dispatch = useDispatch();

    const { t, i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        dispatch(setLanguage(lng));
    };
    const handleLanguageChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedLanguage = event.target.value;
        changeLanguage(selectedLanguage);
    };
    return (
        <div className=" bg-gray-100 py-0.5 text-sm">
            <div className="max-w-screen-xl container mx-auto px-2 sm:px-4 flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium sm:font-normal">
                    <Link
                        to="/seregela-gebeya-v2/wishlist"
                        className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 relative hover:text-[#e7a334]"
                    >
                        <FaRegHeart size={16} />

                        <span>{t("wishlist")}</span>
                    </Link>
                    <Link
                        to="/seregela-gebeya-v2/profile"
                        className="flex items-center gap-1 text-[10px] sm:text-sm  text-gray-600 hover:text-[#e7a334]"
                    >
                        <FaTruckFast size={20} />
                        <span>{t("track_order")}</span>
                    </Link>
                </div>
                {/* <div className="hidden xl:flex items-center justify-between mt-0">
                    <div className="flex items-center space-x-2">
                        <img
                            src={freeDelivery}
                            alt="Delivery Truck"
                            className="w-14 h-12 object-contain"
                        />
                        <span className="text-[10px] sm:text-sm text-center text-gray-600">
                            {t("from_2,000_birr")}
                            <br />
                            <strong>{t("Addis_ababa_only")}</strong>
                        </span>
                    </div>
                </div> */}
                <div className="flex items-center gap-2 sm:gap-4 font-medium sm:font-normal">
                    <Link
                        to="tel: +2517878"
                        className="flex items-center gap-1 text-[10px] sm:text-sm text-gray-600 hover:text-[#e7a334]"
                    >
                        <Phone size={16} />
                        <span>{t("contact_us")} 7878 </span>
                    </Link>
                    {/* <div className="flex items-center gap-2 text-[10px] sm:text-sm hover:text-[#e7a334]">
                        <Globe size={16} />
                        <select
                            className="bg-transparent border-none text-gray-600 cursor-pointer "
                            onChange={handleLanguageChange}
                            value={i18n.language}
                        >
                            <option value="en">English</option>
                            <option value="am">አማርኛ</option>
                        </select>
                    </div> */}
                    <div className="flex items-center gap-2 text-[10px] sm:text-sm hover:text-amber-500 cursor-pointer">
                        <select
                            className="appearance-none bg-transparent border-none text-gray-600 cursor-pointer pr-8 focus:outline-none"
                            onChange={handleLanguageChange}
                            value={i18n.language}
                            aria-label="Change Language"
                        >
                            <option value="en">🇬🇧 English</option>
                            <option value="am">🇪🇹 አማርኛ</option>
                        </select>
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
