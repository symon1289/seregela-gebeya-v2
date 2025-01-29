import React, { useCallback, useMemo, useState } from "react";
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
import { savePaymentMethod, clearCart } from "../store/features/cartSlice";
import { setReceipt, removeReceipt } from "../store/features/orderSlice";
import { paymentOptions } from "../config/paymentOptions";
import PriceFormatter from "../components/PriceFormatter";
import logomini from "../assets/logo.png";

const Payment: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    discountsQuery,
    createOrderMutation,
    cancelOrderMutation,
    makePaymentMutation,
  } = useOrder();
  const { data: discounts } = discountsQuery;
  const cartItems = useSelector((state: RootState) => state.cart);
  const shippingDetails = useSelector(
    (state: RootState) => state.cart.shippingDetails
  );
  const deliveryType = useSelector(
    (state: RootState) => state.cart.delivery_type_id
  );
  const [showApprove, setShowApprove] = useState(0);
  const [orderReturn, setOrderReturn] = useState<any>({});
  const [paymentOptionId, setPaymentOptionId] = useState<number | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountType | null>(
    null
  );
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

  const { subtotal, shipping, grandTotal, freeShipping } = useMemo(
    () => calculateCartTotals(cartItems.items, cartItems.packages),
    [cartItems]
  );
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const orderId = useSelector((state: RootState) => state.order.receipt?.id);
  const createdAt = useSelector(
    (state: RootState) => state.order.receipt?.created_at
  );

  // Handle payment option change
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

  // Handle discount selection
  const handleDiscountSelect = (discount: DiscountType) => {
    setSelectedDiscount(discount);
    setOrderDetail(
      (prev) =>
        ({
          ...prev,
          discount_type_id: discount.id,
        } as OrderDetail)
    );
  };

  // Handle order submission
  const handleOrderSubmit = useCallback(async () => {
    if (!orderDetail) {
      toast.error(t("error.no_payment_selected"));
      return;
    }

    if (!deliveryType) {
      toast.error(t("error.delivery_type_not_selected"));
      return;
    }

    const preparedOrderDetail: OrderDetail = {
      ...orderDetail,
      shipping_detail: shippingDetails,
      delivery_type_id: deliveryType,
      discount_type_id: selectedDiscount?.id,
      products: cartItems.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      packages: cartItems.packages.map((pkg) => ({
        id: pkg.id,
        quantity: pkg.quantity,
      })),
    };

    createOrderMutation.mutate(preparedOrderDetail, {
      onSuccess: (response) => {
        toast.success(t("success.order_placed"));
        setOrderReturn(response);
        setShowApprove(1);
        setTimeout(() => {
          dispatch(setReceipt(response));
        }, 2000);

        console.log("Order placed:", response);
      },
      onError: (error) => {
        toast.error(t("error.order_failed"));
        console.error("Error making order:", error);
      },
    });
  }, [
    orderDetail,
    cartItems,
    createOrderMutation,
    t,
    deliveryType,
    shippingDetails,
    selectedDiscount,
    dispatch,
  ]);

  const handleOrderApprove = useCallback(() => {
    if (
      ["loan", "awash-birr", "cbe", "apollo"].includes(
        orderReturn.payment_method
      )
    ) {
      if (
        orderReturn.payment_method === "loan" &&
        orderReturn.total_cost > userData.loan_balance
      ) {
        setShowApprove(0);
        toast.error(`Insufficient balance: ${userData.loan_balance}`);
      } else {
        navigate(
          orderReturn.payment_method === "loan"
            ? "/orderOTP"
            : orderReturn.payment_method === "cbe"
            ? "/cbebanking"
            : orderReturn.payment_method === "apollo"
            ? "/apollo"
            : "/awashOTP"
        );
      }
    } else {
      makePaymentMutation.mutate(orderReturn.id, {
        onSuccess: (response) => {
          setShowApprove(0);
          if (response.toPayUrl) {
            setShowApprove(0);
            setTimeout(() => {
              window.open(response.toPayUrl, "_self");
            }, 500);
          } else if (response.data.invoice.cbe_pay_checkout_id) {
            const checkoutID = response.data.invoice.cbe_pay_checkout_id;
            const orderID = response.data.id;
            openCbeWidget(checkoutID, orderID);
            setShowApprove(2);
          } else if (response.data.payment_method === "cbe-birr") {
            navigate("/cbebirr");
          } else {
            setShowApprove(0);
            navigate("/");
          }
        },
        onError: (error) => {
          toast.error(t("error.order_approve_failed"));
          console.error("Error approving order:", error);
        },
      });
    }
  }, [makePaymentMutation, navigate, t, orderReturn, userData]);
  const openCbeWidget = (checkoutID: string, orderID: string) => {
    const cbepayWidget = document.createElement("script");
    cbepayWidget.src = `https://oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutID}`;
    document.head.appendChild(cbepayWidget);
    localStorage.setItem("checkoutID", orderID);
  };

  const closeWidget = () => {
    if ((window as any).wpwl && (window as any).wpwl.unload) {
      (window as any).wpwl.unload();
      document.head.removeChild(
        document.querySelector('script[src*="paymentWidgets.js"]')!
      );
      localStorage.removeItem("checkoutID");
    }
    setShowApprove(1);
  };

  const handleOrderCancel = useCallback(() => {
    cancelOrderMutation.mutate(orderReturn.id, {
      onSuccess: () => {
        toast.success(t("success.order_cancelled"));
        dispatch(clearCart());
        dispatch(removeReceipt(orderReturn.id));
        navigate("/");
      },
      onError: (error) => {
        toast.error(t("error.order_cancel_failed"));
        console.error("Error cancelling order:", error);
      },
    });
  }, [cancelOrderMutation, orderReturn.id, navigate, t, dispatch]);

  return (
    <>
      <Meta config={getPaymentMethodsMetaTags()} />
      {showApprove === 0 && (
        <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-3 ">
          <CheckoutSteps step1 step2 />
          <div className="grid lg:grid-cols-2 ">
            {/* Payment Options */}
            <div className="px-4 pt-8">
              <p className="text-xl font-medium">{t("shipping_methods")}</p>
              <p className="text-gray-400">
                {t("shipping_details_desc_delivery_type")}
              </p>

              <form className="mt-5 grid sm:grid-cols-2 gap-2">
                {createOrderMutation.isPending ? (
                  <Loader />
                ) : (
                  paymentOptions.map((item) => (
                    <div
                      className="relative hover:cursor-pointer hover:bg-gray-50 hover:text-[#e9a83a]"
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
                        className="peer-checked:border-2 peer-checked:border-[#e9a83a] peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 py-6 px-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-[#e9a83a]"
                        htmlFor={`radio_${item.id}`}
                      >
                        <img
                          className="w-14 h-7 object-contain object-center"
                          src={item.image}
                          alt={item.name}
                        />
                        <div className="ml-5">
                          <span className="mt-2 font-semibold">
                            {item.name}
                          </span>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
              <p className="text-xl font-medium">{t("order_summary")}</p>
              <p className="text-gray-400 line-clamp-1">
                {t("order_summary_check")}
              </p>
              <div className="mt-4 space-y-3 rounded-lg overflow-y-auto border max-h-72 bg-white px-2 py-4 sm:px-6">
                {/* Cart Items */}
                <div className="border-b border-gray-200">
                  {cartItems.items.map((item) => (
                    <Link
                      to={`/seregela-gebeya-v2/products/${item.id}`}
                      key={item.id}
                      className="flex hover:text-[#e9a83a] hover:cursor-pointer flex-row rounded-lg bg-white sm:flex-row"
                    >
                      <img
                        className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                        src={item.image_paths[0]}
                        alt={item.name}
                      />
                      <div className="flex w-full flex-col px-4 py-4">
                        <span className="font-semibold line-clamp-1">
                          {item.name}
                        </span>
                        <span className="float-right text-gray-400">
                          {item.quantity}
                        </span>
                        <p className="text-lg font-bold">
                          <PriceFormatter price={item.price.toString()} />
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Packages */}
                {cartItems.packages.map((item) => (
                  <Link
                    to={`/products/${item.id}`}
                    key={item.id}
                    className="flex flex-row rounded-lg bg-white sm:flex-row"
                  >
                    <img
                      className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                      src={item.image_path}
                      alt={item.name}
                    />
                    <div className="flex w-full flex-col px-4 py-4">
                      <span className="font-semibold line-clamp-1">
                        {item.name}
                      </span>
                      <span className="float-right text-gray-400">
                        {item.quantity}
                      </span>
                      <p className="text-lg font-bold">
                        <PriceFormatter price={item.price.toString()} />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Discounts */}
              {discounts && discounts.length > 0 && (
                <div className="mt-4 space-y-3 rounded-lg overflow-y-auto border max-h-72 bg-white px-2 py-4 sm:px-6">
                  <div className="mt-6 border-t border-b py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {t("discount")}
                      </p>
                    </div>
                  </div>
                  <div className="border-b border-gray-200">
                    {discounts.map((item: DiscountType) => (
                      <button
                        name="discount"
                        key={item.id}
                        className={`flex hover:text-[#e9a83a] hover:cursor-pointer flex-col rounded-lg bg-white sm:flex-row ${
                          selectedDiscount?.id === item.id ? "bg-gray-100" : ""
                        }`}
                        onClick={() => handleDiscountSelect(item)}
                      >
                        <div className="flex w-full flex-col px-4 py-4">
                          <span className="font-semibold">{item.name}</span>
                          <span className="float-right text-gray-400">
                            {item.discount}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Totals */}
              <div className="mt-6 border-t border-b py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {t("sub_total")}
                  </p>
                  <p className="font-semibold text-gray-900">
                    <PriceFormatter price={subtotal.toString()} />
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
                        <PriceFormatter price={shipping.toString()} />
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
                  <PriceFormatter price={grandTotal.toString()} />
                </p>
              </div>
              <button
                className="mt-4 mb-8 w-full rounded-md bg-[#e9a83a] hover:bg-[#fed874] px-6 py-3 font-medium text-white"
                onClick={handleOrderSubmit}
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? t("processing") : t("buy_now")}
              </button>
            </div>
          </div>
        </div>
      )}
      {showApprove === 1 && (
        <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-3 ">
          <CheckoutSteps step1 step2 step3 />
          <div className="bg-white rounded-lg shadow-lg px-8 py-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 mr-2"
                  src={logomini}
                  alt="seregelagebeya"
                />
                <div className="text-gray-700 font-semibold text-lg flex flex-col">
                  <p className="logo-english">SeregelaGebeya</p>
                  <p className="logo-amharic">ሠረገላ ገበያ</p>
                </div>
              </div>
              <div className="text-gray-700">
                <div className="font-bold text-xl mb-2">
                  {t("approve_and_pay")}
                </div>
                <div className="text-sm">
                  {t("date")}: {createdAt?.slice(0, 10)}{" "}
                </div>
                <div className="text-sm">Order ID: {orderId}</div>
              </div>
            </div>
            <div className="border-b-2 border-gray-300 pb-8 mb-8">
              <h2 className="text-2xl text-gray-700 font-bold mb-4">
                {userData?.first_name} {userData?.last_name}
              </h2>
              <div className="text-gray-700 mb-2">{userData.name}</div>
              <div className="text-gray-700 mb-2">{userData.phone_number}</div>
              <div className="text-gray-700 mb-2">
                {userData.address.city}, {userData.address.sub_city},{" "}
                {userData.address.woreda}
              </div>
              <div className="text-gray-700">{userData.email}</div>
            </div>
            <table className="w-full text-left mb-8">
              <thead>
                <tr>
                  <th className="text-gray-700 font-bold uppercase py-2">
                    {t("products")}
                  </th>
                  <th className="text-gray-700 font-bold uppercase py-2">
                    {t("quantity")}
                  </th>
                  <th className="text-gray-700 font-bold uppercase py-2">
                    {t("unit_price")}
                  </th>
                  <th className="text-gray-700 font-bold uppercase py-2">
                    {t("total_price")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderReturn.products &&
                  orderReturn.products?.map((product: any) => (
                    <tr key={product.id}>
                      <td className="py-4 text-gray-700 line-clamp-1">
                        {product.name}
                      </td>
                      <td className="py-4 text-gray-700">
                        {product.pivot.quantity}
                      </td>
                      <td className="py-4 text-gray-700">
                        <PriceFormatter price={product.price.toString()} />{" "}
                      </td>
                      <td className="py-4 text-gray-700">
                        <PriceFormatter
                          price={(
                            product.price * product.pivot.quantity
                          ).toString()}
                        />
                      </td>
                    </tr>
                  ))}

                {orderReturn.packages &&
                  orderReturn.packages?.map((product: any) => (
                    <tr key={product.id}>
                      <td className="py-4 text-gray-700 line-clamp-1">
                        {product.name}
                      </td>
                      <td className="py-4 text-gray-700">
                        {product.pivot.quantity}
                      </td>
                      <td className="py-4 text-gray-700">
                        <PriceFormatter price={product.price.toString()} />{" "}
                      </td>
                      <td className="py-4 text-gray-700">
                        <PriceFormatter
                          price={(
                            product.price * product.pivot.quantity
                          ).toString()}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-end mb-8">
              <div className="text-gray-700 mr-2">{t("sub_total")}:</div>
              <div className="text-gray-700">
                <PriceFormatter price={orderReturn.order_cost.toString()} />
              </div>
            </div>
            <div className="text-right mb-8">
              <div className="text-gray-700 mr-2">{t("delivery")}:</div>
              <div className="text-gray-700">
                {orderReturn.delivery_cost === 0 ? (
                  <span className="font-semibold text-green-600">
                    {t("free")}
                  </span>
                ) : (
                  <PriceFormatter
                    price={orderReturn.delivery_cost.toString()}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-end mb-8">
              <div className="text-gray-700 mr-2">{t("total_price")}:</div>
              <div className="text-gray-700 font-bold text-xl">
                <PriceFormatter price={orderReturn.total_cost.toString()} />
              </div>
            </div>
            <div className="border-t-2 border-gray-300 pt-8 mb-8">
              <span className="w-full flex justify-around">
                <button
                  className="w-1/3 py-1 px-2 bg-red-500"
                  onClick={handleOrderCancel}
                >
                  {t("cancel")}
                </button>
                <button
                  className="w-1/3 py-1 px-2 bg-green-500"
                  onClick={handleOrderApprove}
                >
                  {t("approve")}
                </button>
              </span>
            </div>
          </div>
        </div>
      )}
      {showApprove === 2 && (
        <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-3 ">
          <CheckoutSteps step1 step2 step3 />
          <div className="absolute top-0 h-screen w-full bg-black bg-opacity-60 flex flex-col justify-center items-center">
            <div className="xl:w-1/2 lg:w-2/3 w-11/12 xl:h-1/2 lg:h-2/3 h-5/6 xl:px-3 lg:px-2 px-1 py-2 bg-transparent p-2 flex flex-col space-y-3 text-black">
              <span className="flex w-full">
                <svg
                  onClick={closeWidget}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="white"
                  className="xl:w-11 xl:h-11 w-6 h-6 self-end cursor-pointer"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
              <form
                action={`https://seregelagebeya.com/receipt/${orderReturn.id}`}
                className="paymentWidgets"
                data-brands="VISA MASTER AMEX"
              ></form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
