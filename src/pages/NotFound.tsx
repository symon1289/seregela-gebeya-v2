import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getNotFoundMetaTags } from "../config/meta";
import Meta from "../components/Meta";

const NotFound: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Meta config={getNotFoundMetaTags()} />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-9xl font-bold text-gray-800">404</h1>
                    <h2 className="text-4xl font-semibold text-gray-600 mt-4">
                        {t("page_not_found")}
                    </h2>
                    <p className="text-gray-500 mt-4 mb-8">
                        {t("page_not_found_desc")}
                    </p>
                    <Link
                        to="/"
                        className="px-6 py-3 text-white rounded-lg bg-primary hover:bg-secondary  transition-colors duration-300"
                    >
                        {t("go_to_home_page")}
                    </Link>
                </div>
            </div>
        </>
    );
};

export default NotFound;
