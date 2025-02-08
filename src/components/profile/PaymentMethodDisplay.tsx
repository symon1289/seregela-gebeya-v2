import React from "react";
import { paymentOptions } from "../../config/paymentOptions";

interface PaymentProps {
  paymentMethod: string;
}

const PaymentMethodDisplay: React.FC<PaymentProps> = ({ paymentMethod }) => {
  const getPaymentImage = (paymentMethod: string) => {
    const payment = paymentOptions.find(
      (option) => option.sendingName === paymentMethod
    );
    return payment ? payment.image : null;
  };
  const paymentImage = getPaymentImage(paymentMethod);

  return (
    <div className="flex items-center gap-2">
      {paymentImage ? (
        <img
          src={paymentImage}
          alt={paymentMethod}
          className="w-20 h-20 object-contain rounded-xl"
        />
      ) : (
        <span></span>
      )}
      <p className="text-lg font-semibold capitalize">{paymentMethod}</p>
    </div>
  );
};

export default PaymentMethodDisplay;
