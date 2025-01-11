import { Home, Globe, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../store/features/languageSlice";
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
    <div className=" bg-gray-100 py-2 text-sm">
      <div className="max-w-screen-xl container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-600 hover:text-[#e7a334]"
          >
            <Home size={16} />
            <span>Seregela Gebeya</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="tel: +2517878"
            className="flex items-center gap-1 text-gray-600 hover:text-[#e7a334]"
          >
            <Phone size={16} />
            <span>{t("contact_us")} 7878 </span>
          </Link>
          <div className="flex items-center gap-2 hover:text-[#e7a334]">
            <Globe size={16} />
            <select
              className="bg-transparent border-none text-gray-600 cursor-pointer "
              onChange={handleLanguageChange}
              value={i18n.language}
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
