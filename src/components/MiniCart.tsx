import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import defaultImage from "../assets/no-image-available-02.jpg";
import PriceFormatter from "./PriceFormatter";
import { useTranslation } from "react-i18next";
const MiniCart: React.FC = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleContinueToCart = () => {
    setShow(false);
    navigate("/seregela-gebeya-v2/cart");
  };

  useEffect(() => {
    if (location.pathname === "/seregela-gebeya-v2" && cartItems.length > 0) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [location.pathname, cartItems.length]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4  bg-white rounded-xl shadow-md p-4 max-w-[300px] z-10 animate-slide-in slide-in mini-cart-container">
      <h3 className="text-lg font-medium text-gray-800 mb-3 mt-5">
        {t("donst_miss")}
      </h3>
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-primary hover:text-gray-700 cursor-pointer"
      >
        <IoMdCloseCircle size={24} />
      </button>
      <div className="max-h-[200px] overflow-y-auto">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center py-2 border-b border-gray-200 last:border-b-0"
          >
            <img
              src={item.image_paths?.[0] || defaultImage}
              alt={item.name}
              className="w-10 h-10 object-cover rounded-sm mr-3"
            />
            <div>
              <p className="text-sm text-gray-800 line-clamp-2">{item.name}</p>
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <PriceFormatter price={item.price} />{" "}
                <p className="flex items-center text-sm text-gray-600 mt-1 ml-2">
                  x {item.quantity}
                </p>
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleContinueToCart}
        className="mt-3 bg-amber-500 hover:bg-amber-400 w-full text-white py-2 px-4 rounded-full text-sm transition-colors"
      >
        Continue to Cart
      </button>
    </div>
  );
};

export default MiniCart;
