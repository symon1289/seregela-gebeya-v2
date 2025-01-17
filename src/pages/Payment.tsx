import React, { useCallback, useEffect, useMemo, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import { DiscountType, OrderDetail } from "../types/order";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { calculateCartTotals } from "../utils/CartUtils";
import { getPaymentMethodsMetaTags } from "../config/meta";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";
import { savePaymentMethod } from "../store/features/cartSlice";
import { paymentOptions } from "../config/paymentOptions";

const Payment: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getDiscounts, makeOrder, error } = useOrder();
  const cartItems = useSelector((state: RootState) => state.cart);
  const shippingDetails = useSelector(
    (state: RootState) => state.cart.shippingDetails
  );
  const deliveryType = useSelector(
    (state: RootState) => state.cart.delivery_type_id
  );

  const [discountTypes, setDiscountTypes] = useState<DiscountType[]>([]);
  const [paymentOptionId, setPaymentOptionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  const { subtotal, shipping, grandTotal, freeShipping } = useMemo(
    () => calculateCartTotals(cartItems.items, cartItems.packages),
    [cartItems]
  );

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      try {
        const discounts = await getDiscounts();
        setDiscountTypes(discounts);
      } catch (err) {
        toast.error(t("error.fetch_discounts"));
        console.error("Error fetching discounts:", err);
      }
    };
    fetchDiscountTypes();
  }, [t]);
  const handlePaymentChange = (id: number) => {
    setPaymentOptionId(id);
    const selectedOption = paymentOptions.find((option) => option.id === id);
    if (selectedOption && selectedOption.sendingName) {
      setOrderDetail(
        (prev) =>
          ({
            ...prev,
            payment_method: selectedOption.sendingName,
          } as OrderDetail)
      );
      dispatch(savePaymentMethod(selectedOption.sendingName));
    }
  };

  const handleOrderSubmit = useCallback(async () => {
    if (!orderDetail) {
      toast.error(t("error.no_payment_selected"));
      return;
    }

    setLoading(true);
    if (!deliveryType) {
      toast.error(t("error.delivery_type_not_selected"));
      return;
    }

    const preparedOrderDetail = {
      ...orderDetail,
      shipping_detail: shippingDetails,
      delivery_type_id: deliveryType,
      products: cartItems.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      packages: cartItems.packages.map((pkg) => ({
        id: pkg.id,
        quantity: pkg.quantity,
      })),
    };
    try {
      await makeOrder(preparedOrderDetail);
      toast.success(t("success.order_placed"));
      navigate("/order-success");
    } catch (error) {
      toast.error(t("error.order_failed"));
      console.error("Error making order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderDetail, cartItems, makeOrder, t, navigate]);

  const formatPrice = (price: string): string => {
    const numPrice = parseFloat(price);
    const formattedPrice = numPrice.toFixed(2);
    const [integerPart, decimalPart] = formattedPrice.split(".");
    return (
      `${parseInt(integerPart).toLocaleString("en-US")}.${decimalPart} ` +
      t("birr")
    );
  };
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (discountTypes.length === 0) {
    return;
  }
  return (
    <>
      <Meta config={getPaymentMethodsMetaTags()} />
      <div>
        <CheckoutSteps step1 step2 />
        <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">{t("shipping_methods")}</p>
            <p className="text-gray-400">
              {t("shipping_details_desc_delivery_type")}
            </p>

            <form className="mt-5 grid sm:grid-cols-2 gap-1">
              {loading ? (
                <Loader />
              ) : (
                paymentOptions.map((item) => (
                  <div
                    className="relative  hover:cursor-pointer hover:bg-gray-50 hover:text-[#e9a83a]"
                    key={item.id}
                  >
                    <input
                      className="peer hidden"
                      id={`radio_${item.id}`}
                      type="radio"
                      name="radio"
                      value={item.id}
                      onChange={() => handlePaymentChange(item.id)}
                      checked={paymentOptionId === item.id}
                    />
                    <span className="peer-checked:border-[#e9a83a] absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                    <label
                      className="peer-checked:border-2 peer-checked:border-[#e9a83a] peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                      htmlFor={`radio_${item.id}`}
                    >
                      <img
                        className="w-14 object-contain"
                        src={item.image}
                        alt={item.name}
                      />
                      <div className="ml-5">
                        <span className="mt-2 font-semibold">{item.name}</span>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </form>
          </div>
          <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
            <p className="text-xl font-medium">{t("order_summary")}</p>
            <p className="text-gray-400 line-clamp-1">
              {t("order_summary_check")}
            </p>
            <div className="mt-4 space-y-3 rounded-lg overflow-y-auto border max-h-72  bg-white px-2 py-4 sm:px-6">
              <div className="border-b  border-gray-200">
                {cartItems.items.map((item) => (
                  <Link
                    to={`/products/${item.id}`}
                    className="flex hover:text-[#e9a83a] hover:cursor-pointer flex-col rounded-lg bg-white sm:flex-row"
                  >
                    <img
                      className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                      src={item.image_paths[0]}
                      alt={item.name}
                    />
                    <div className="flex w-full flex-col px-4 py-4">
                      <span className="font-semibold">{item.name}</span>
                      <span className="float-right text-gray-400">
                        {item.quantity}
                      </span>
                      <p className="text-lg font-bold">
                        {formatPrice(item.price.toString())}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {cartItems.packages.map((item) => (
                <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={item.image_path}
                    alt={item.name}
                  />
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-semibold">{item.name}</span>
                    <span className="float-right text-gray-400">
                      {item.quantity}
                    </span>
                    <p className="text-lg font-bold">
                      {formatPrice(item.price.toString())}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {t("sub_total")}
                </p>
                <p className="font-semibold text-gray-900">
                  {formatPrice(subtotal.toString())}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {t("delivery")}
                </p>
                <p className="font-semibold text-gray-900">
                  {freeShipping ? (
                    <span className="font-semibold text-green-600">
                      {t("free")}
                    </span>
                  ) : (
                    <span className="font-semibold">
                      {formatPrice(shipping.toString())}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {t("total_price")}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(grandTotal.toString())}
              </p>
            </div>
            <button
              className="mt-4 mb-8 w-full rounded-md bg-[#e9a83a] hover:bg-[#fed874] px-6 py-3 font-medium text-white"
              onClick={handleOrderSubmit}
            >
              {t("buy_now")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
