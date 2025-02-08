import { Link } from 'react-router-dom';
import { FaAnglesUp, FaFacebookF } from 'react-icons/fa6';
import { PiInstagramLogoFill } from 'react-icons/pi';
import { BiLogoTelegram } from 'react-icons/bi';
import { ImLinkedin2 } from 'react-icons/im';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import { useCategory } from '../hooks/useCategory';

const Footer = () => {
    const { categories: categories, isLoading, error } = useCategory();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const { t } = useTranslation();

    return (
        <footer className="bg-[#e7a334]">
            <div className="w-full p-2 bg-gray-900/15">
                <button
                    onClick={scrollToTop}
                    className="mx-auto items-center justify-center flex flex-col gap-1 text-white hover:text-amber-200 transition-colors"
                >
                    <FaAnglesUp
                        size={25}
                        className="animate-bounce hover:animate-ping"
                    />
                    <span className="font-bold back-t-top text-[30px]">
                        {t('back_to_top')}
                    </span>
                </button>
            </div>

            <div className="max-w-screen-xl mx-auto px-4 py-8">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:place-items-center lg:place-items-start sm:text-center md:text-center lg:text-left">
                    {/* Company Info */}
                    <div className="space-y-4 flex flex-col items-center md:items-center lg:items-start">
                        <div className="justify-center items-center gap-2">
                            <img src={logo} alt="logo" className="w-16 h-14" />
                            <h2 className="text-2xl font-bold text-white">
                                Seregela Gebeya
                            </h2>
                        </div>
                        <p className="text-white download-our-app">
                            Stay in Touch With Us
                        </p>
                        <div className="flex space-x-4 justify-center md:justify-center lg:justify-start">
                            <Link
                                to="/seregela-gebeya-v2"
                                className="text-[#e7a334] bg-white flex items-center justify-center rounded w-[34.53px] h-[34.53px] hover:text-amber-200 transition-colors"
                            >
                                <FaFacebookF size={24} />
                            </Link>
                            <Link
                                to="/seregela-gebeya-v2"
                                className="text-[#e7a334] bg-white flex items-center justify-center rounded w-[34.53px] h-[34.53px] hover:text-amber-200 transition-colors"
                            >
                                <ImLinkedin2 size={24} />
                            </Link>
                            <Link
                                to="/seregela-gebeya-v2"
                                className="text-[#e7a334] bg-white flex items-center justify-center rounded w-[34.53px] h-[34.53px] hover:text-amber-200 transition-colors"
                            >
                                <PiInstagramLogoFill size={24} />
                            </Link>
                            <Link
                                to="/seregela-gebeya-v2"
                                className="text-[#e7a334] bg-white flex items-center justify-center rounded w-[34.53px] h-[34.53px] hover:text-amber-200 transition-colors"
                            >
                                <BiLogoTelegram size={24} />
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-white download-our-app text-center lg:text-left">
                                Download Our App
                            </h3>
                            <div className="flex gap-2 justify-center lg:justify-start">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                    alt="App Store"
                                    className="h-8"
                                />
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Play Store"
                                    className="h-8"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-col items-center md:items-center lg:items-start">
                        <h3 className="text-lg font-semibold text-white mb-4 h-3-footer">
                            {t('categories')}
                        </h3>
                        <ul className="space-y-2 text-amber-100">
                            {isLoading ? (
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full absolute border border-solid border-gray-200"></div>
                                    <div className="w-12 h-12 rounded-full animate-spin absolute border border-solid border-[#e9a83a] border-t-transparent"></div>
                                </div>
                            ) : error ? (
                                <div>{error}</div>
                            ) : (
                                categories
                                    .sort((a, b) =>
                                        a.name.localeCompare(b.name)
                                    )
                                    .map((category) => (
                                        <li
                                            className="li-footer-footer"
                                            key={category.id}
                                        >
                                            <Link
                                                to={`/seregela-gebeya-v2/category/${category.id}`}
                                                className="hover:text-white transition-colors"
                                            >
                                                {t(category.name)}
                                            </Link>
                                        </li>
                                    ))
                            )}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="flex flex-col items-center md:items-center lg:items-start">
                        <h3 className="text-lg font-semibold text-white mb-4 h-3-footer">
                            {t('customer_service')}
                        </h3>
                        <ul className="space-y-2 text-amber-100">
                            <li className="li-footer-footer">
                                <Link
                                    to="/contact"
                                    className="hover:text-white transition-colors"
                                >
                                    {t('contact_us')}
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    {t('shipping_policy')}
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    {t('return_policy')}
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/faq"
                                    className="hover:text-white transition-colors"
                                >
                                    FAQs
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/size-guide"
                                    className="hover:text-white transition-colors"
                                >
                                    Size Guide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div className="flex flex-col items-center md:items-center lg:items-start">
                        <h3 className="text-lg font-semibold text-white mb-4 h-3-footer">
                            {t('about_seregela')}
                        </h3>
                        <ul className="space-y-2 text-amber-100">
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    Our Story
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li className="li-footer-footer">
                                <Link
                                    to="/seregela-gebeya-v2"
                                    className="hover:text-white transition-colors"
                                >
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-amber-400/30">
                    <p className="text-center text-white">
                        {new Date().getFullYear()} Seregela Gebeya. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
