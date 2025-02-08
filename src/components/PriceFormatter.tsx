import React from "react";
import { useTranslation } from "react-i18next";

interface PriceFormatterProps {
    price: string;
}

const PriceFormatter: React.FC<PriceFormatterProps> = ({ price }) => {
    const { t } = useTranslation();
    const formatPrice = (price: string): string => {
        const numPrice = parseFloat(price);
        const formattedPrice = numPrice.toFixed(2);
        const [integerPart, decimalPart] = formattedPrice.split(".");
        return (
            `${parseInt(integerPart).toLocaleString("en-US")}.${decimalPart} ` +
            t("birr")
        );
    };

    return <span>{formatPrice(price)}</span>;
};

export default PriceFormatter;
