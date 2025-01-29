import React, { useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Link, useNavigate } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { calculateCartTotals } from "../utils/CartUtils";
import { getDeliveryMetaTags } from "../config/meta";
import Meta from "../components/Meta";
import { useTranslation } from "react-i18next";
import {
  saveShippingDetails,
  saveDeliveryType,
} from "../store/features/cartSlice";
import PriceFormatter from "../components/PriceFormatter";
const Delivery: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { deliveryTypesQuery } = useOrder();
  const {
    data: deliveryTypes,
    isLoading,
    isError,
    error,
    refetch,
  } = deliveryTypesQuery;
  const cartItems = useSelector((state: RootState) => state.cart);
  // @ts-expect-error user is not null
  const user = JSON.parse(localStorage.getItem("user"));
  const address = user?.address;
  const [selectedDeliveryType, setSelectedDeliveryType] = useState<number>(0);
  const [locationClicked, setLocationClicked] = useState<boolean>(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 0,
    longitude: 0,
  });
  const [customLocation, setCustomLocation] = useState({
    city: address?.city || "",
    woreda: address?.woreda || "",
    sub_city: address?.sub_city || "",
    neighborhood: "",
    house_number: address?.house_number || "",
  });
  const [disableInput, setDisableInput] = useState<boolean>(false);

  const { subtotal, shipping, grandTotal, freeShipping } = calculateCartTotals(
    cartItems.items,
    cartItems.packages
  );

  const getCurrentLocation = () => {
    setLocationClicked(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          toast.success("Location registered");
        },
        (err) => {
          toast.error(err.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setLocationClicked(false);
    }
    setDisableInput(true);
  };

  const handleSubmit = () => {
    if (
      location.latitude &&
      customLocation.neighborhood.length > 0 &&
      selectedDeliveryType !== 0
    ) {
      // Emit event or dispatch state
      dispatch(
        saveShippingDetails({
          latitude: location.latitude,
          longitude: location.longitude,
          neighborhood: customLocation.neighborhood,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          city: customLocation.city,
          sub_city: customLocation.sub_city,
          woreda: customLocation.woreda,
          house_number: customLocation.house_number,
        })
      );

      dispatch(saveDeliveryType(selectedDeliveryType));

      navigate("/seregela-gebeya-v2/checkout/payment");
    } else {
      if (!location.latitude) {
        if (!locationClicked) {
          toast.warning("Current location is empty");
        } else {
          getCurrentLocation();
        }
      }
      if (customLocation.neighborhood.length < 4) {
        toast.warning("Neighborhood is empty");
      }
      if (!selectedDeliveryType) {
        toast.warning("Please select a shipping method.");
      }
    }
  };

  return (
    <>
      <Meta config={getDeliveryMetaTags()} />
      <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-3 ">
        <CheckoutSteps step1 />
        <div className="grid lg:grid-cols-2 ">
          <div className="px-4 pt-8">
            <p className="text-xl font-medium">{t("shipping_methods")}</p>
            <p className="text-gray-400">
              {t("shipping_details_desc_delivery_type")}
            </p>

            <form className="mt-5 grid md:grid-cols-3 gap-2">
              {isLoading ? (
                <Loader />
              ) : isError ? (
                <div className="mx-auto px-4 py-12">
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
                        <p className="text-sm text-red-700">{error.message}</p>
                        <button onClick={() => (refetch as any)()}>
                          Retry
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                deliveryTypes?.map((item) => (
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
                      onChange={() => setSelectedDeliveryType(item.id)}
                      checked={selectedDeliveryType === item.id}
                    />
                    <span className="peer-checked:border-[#e9a83a] absolute right-3 top-1/2 lg:top-6 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                    <label
                      className="peer-checked:border-2 peer-checked:border-[#e9a83a] peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                      htmlFor={`radio_${item.id}`}
                    >
                      <div className="ml-1">
                        <span className="mt-2 font-semibold lg:line-clamp-1">
                          {item.name}
                        </span>
                        <p className="text-slate-500 text-xs xl:text-sm  lg:line-clamp-1 leading-6">
                          {t("delivery")}:{" "}
                          {item.number_of_days === 1
                            ? `${item.number_of_days} ${t("day")}`
                            : `${item.number_of_days} ${t("days")}`}
                        </p>
                      </div>
                    </label>
                  </div>
                ))
              )}
            </form>

            <div className=" pt-4 mt-4 justify-between items-center flex">
              <div>
                <p className="text-xl font-medium">{t("shipping_details")}</p>
                <p className="text-gray-400 line-clamp-1">
                  {t("shipping_details_desc")}
                </p>
              </div>
              <div>
                <button
                  className="px-4 py-2 bg-gray-50 flex justify-around items-center w-full border-gray-200 rounded-lg hover:bg-[#fed874] transition-colors duration-300"
                  onClick={getCurrentLocation}
                >
                  <svg
                    className={
                      locationClicked ? "text-[#e9a83a]" : "text-black"
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    width="48px"
                    height="48px"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <path
                      fill="currentColor"
                      d="M13 4.069V2h-2v2.069A8.01 8.01 0 0 0 4.069 11H2v2h2.069A8.008 8.008 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6s6 2.691 6 6s-2.691 6-6 6z"
                    />
                  </svg>
                  {t("current_location")}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="city"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                {t("city")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="city"
                  name="city"
                  disabled={disableInput}
                  className={`w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a] ${
                    disableInput ? "cursor-not-allowed bg-gray-100" : "bg-white"
                  }`}
                  placeholder={t("city_hint")}
                  value={customLocation.city}
                  onChange={(e) =>
                    setCustomLocation({
                      ...customLocation,
                      city: e.target.value,
                    })
                  }
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"></div>
              </div>
              <label
                htmlFor="sub_city"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                {t("sub_city")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="sub_city"
                  name="sub_city"
                  disabled={disableInput}
                  className={`w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a] ${
                    disableInput ? "cursor-not-allowed bg-gray-100" : "bg-white"
                  }`}
                  placeholder={t("sub_city_hint")}
                  value={customLocation.sub_city}
                  onChange={(e) =>
                    setCustomLocation({
                      ...customLocation,
                      sub_city: e.target.value,
                    })
                  }
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"></div>
              </div>
              <label
                htmlFor="neighborhood"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                {t("neighborhood")}
              </label>
              <div className="flex">
                <div className="relative w-7/12 flex-shrink-0">
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    className={`w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a] ${
                      !customLocation.neighborhood
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                    placeholder={t("neighborhood_hint")}
                    value={customLocation.neighborhood}
                    onChange={(e) =>
                      setCustomLocation({
                        ...customLocation,
                        neighborhood: e.target.value,
                      })
                    }
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3"></div>
                </div>
                <input
                  type="text"
                  id="house_number"
                  name="house_number"
                  disabled={disableInput}
                  className={`w-full sm:ml-4 rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#e9a83a] focus:ring-[#e9a83a] ${
                    disableInput ? "cursor-not-allowed bg-gray-100" : "bg-white"
                  }`}
                  placeholder={t("house_number_hint")}
                  value={customLocation.house_number}
                  onChange={(e) =>
                    setCustomLocation({
                      ...customLocation,
                      house_number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
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
                        {t("quantity")}: {item.quantity}
                      </span>
                      <p className="text-lg font-bold">
                        <PriceFormatter price={item.price.toString()} />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              {cartItems.packages.map((item) => (
                <div
                  className="flex flex-row rounded-lg bg-white sm:flex-row"
                  key={item.id}
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
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {t("sub_total")}
                </p>
                <PriceFormatter price={subtotal.toString()} />
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
                    <PriceFormatter price={shipping.toString()} />
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
              onClick={handleSubmit}
            >
              {t("place_order")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delivery;
