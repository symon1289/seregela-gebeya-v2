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
import { savePaymentMethod, clearCart } from "../store/features/cartSlice";
import { setReceipt, removeReceipt } from "../store/features/orderSlice";
import { paymentOptions } from "../config/paymentOptions";
import PriceFormatter from "../components/PriceFormatter";
import logomini from "../assets/logo.png";
import Bunna_Bank from "../assets/payment-option-11.png";
import useUser from "../hooks/useUser";
import PinComponent from "../components/payments/PinComponent";

const Payment: React.FC = () => {
    const noBank = {
        id: 13,
        name: "No Bank",
        image: Bunna_Bank,
        sendingName: "loan",
    };

    const bunnaBank = {
        id: 11,
        name: "Bunna Bank",
        image: Bunna_Bank,
        sendingName: "loan",
    };

    const { fetchUser } = useUser();

    useEffect(() => {
        fetchUser();
    }, []);

    const userData = useSelector((state: RootState) => state.auth.user);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        discountsQuery,
        createOrderMutation,
        cancelOrderMutation,
        makePaymentMutation,
    } = useOrder({});
    const { data: discounts } = discountsQuery;

    const cartItems = useSelector((state: RootState) => state.cart);
    const shippingDetails = useSelector(
        (state: RootState) => state.cart.shippingDetails
    );
    const deliveryType = useSelector(
        (state: RootState) => state.cart.delivery_type
    );
    const deliveryTypeID = useSelector(
        (state: RootState) => state.cart.delivery_type_id
    );
    const orderId = useSelector((state: RootState) => state.order.receipt?.id);
    const createdAt = useSelector(
        (state: RootState) => state.order.receipt?.created_at
    );

    const [showApprove, setShowApprove] = useState(0);
    const [orderReturn, setOrderReturn] = useState<any>({});
    const [orderForPin, setOrderForPin] = useState<any>({});
    const [paymentOptionId, setPaymentOptionId] = useState<number | null>(null);
    const [selectedDiscount, setSelectedDiscount] =
        useState<DiscountType | null>(null);
    const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);

    const { subtotal, shipping, grandTotal, freeShipping } = useMemo(
        () =>
            calculateCartTotals(
                cartItems.items,
                cartItems.packages,
                deliveryType
            ),
        [cartItems, deliveryType]
    );

    // Handle payment option change
    const handlePaymentChange = (id: number) => {
        setPaymentOptionId(id);
        const selectedOption = paymentOptions.find(
            (option) => option.id === id
        );
        if (selectedOption && selectedOption.sendingName) {
            setOrderDetail(
                (prev) =>
                    ({
                        ...prev,
                        payment_method: selectedOption.sendingName,
                    } as OrderDetail)
            );
            dispatch(savePaymentMethod(selectedOption.sendingName));
        } else if (id === noBank.id) {
            setOrderDetail(
                (prev) =>
                    ({
                        ...prev,
                        payment_method: noBank.sendingName,
                    } as OrderDetail)
            );
            dispatch(savePaymentMethod(noBank.sendingName));
        } else {
            setOrderDetail(
                (prev) =>
                    ({
                        ...prev,
                        payment_method: bunnaBank.sendingName,
                    } as OrderDetail)
            );
            dispatch(savePaymentMethod(bunnaBank.sendingName));
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
            delivery_type_id: deliveryTypeID !== null ? deliveryTypeID : 0,
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

        if (orderDetail.payment_method === "loan") {
            setOrderForPin(preparedOrderDetail);
            setShowApprove(3);
        } else {
            createOrderMutation.mutate(preparedOrderDetail, {
                onSuccess: (response) => {
                    setOrderReturn(response);
                    setTimeout(() => {
                        dispatch(setReceipt(response));
                    }, 2000);
                    dispatch(clearCart());
                    toast.success(t("success.order_placed"));
                    setShowApprove(1);
                },
                onError: (error: any) => {
                    toast.error(
                        t("error.order_failed") +
                            " " +
                            error.response?.data?.message
                    );
                    console.error("Error making order:", error);
                },
            });
        }
    }, [
        orderDetail,
        cartItems,
        createOrderMutation,
        t,
        deliveryType,
        deliveryTypeID,
        shippingDetails,
        selectedDiscount,
        dispatch,
    ]);

    const handleOrderApprove = useCallback(() => {
        if (
            ["bunna", "awash-birr", "cbe", "apollo", "abay"].includes(
                orderReturn.payment_method
            )
        ) {
            let path;
            switch (orderReturn.payment_method) {
                case "cbe":
                    path = "/checkout/payment/cbebanking";
                    break;
                case "apollo":
                    path = "/checkout/payment/apollo";
                    break;
                case "abay":
                    path = "/checkout/payment/abay";
                    break;
                case "bunna":
                    path = "/checkout/payment/bunna";
                    break;
                default:
                    path = "/checkout/payment/awashOTP";
            }
            navigate(path);
            setShowApprove(0);
        } else {
            makePaymentMutation.mutate(orderReturn.id, {
                onSuccess: (response) => {
                    setShowApprove(0);
                    if (response.toPayUrl) {
                        const currentDomain = "https://seregelagebeya.com";
                        const toPayUrl = new URL(response.toPayUrl);

                        if (toPayUrl.origin === currentDomain) {
                            // setTimeout(() => {
                            //     const newWindow = window.open(
                            //         toPayUrl,
                            //         "_self"
                            //     );
                            //     if (newWindow) newWindow.opener = null;
                            // }, 200);
                            window.location.assign(response.toPayUrl);
                            return;
                        } else {
                            setShowApprove(0);
                            setTimeout(() => {
                                window.open(response.toPayUrl, "_blank");
                            }, 200);
                        }
                    } else if (response.data.invoice.cbe_pay_checkout_id) {
                        const checkoutID =
                            response.data.invoice.cbe_pay_checkout_id;
                        const orderID = response.data.id;
                        openCbeWidget(checkoutID, orderID);
                        setShowApprove(2);
                    } else if (response.data.payment_method === "cbe-birr") {
                        navigate("/checkout/payment/cbebirr");
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
    }, [makePaymentMutation, navigate, t, orderReturn]);
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
            onError: (error: any) => {
                toast.error(
                    t("error.order_cancel_failed") +
                        " " +
                        error.response?.data?.message
                );
                console.error("Error cancelling order:", error);
            },
        });
    }, [cancelOrderMutation, orderReturn.id, navigate, t, dispatch]);

    return (
        <>
            <Meta config={getPaymentMethodsMetaTags()} />
            {showApprove === 0 && (
                <div className="max-w-screen-xl mx-auto  bg-white pb-6 pt-1 ">
                    <CheckoutSteps step1 step2 />
                    <div className="grid lg:grid-cols-2 ">
                        {/* Payment Options */}
                        <div className="px-4 pt-8">
                            <p className="text-xl font-medium">
                                {t("payment_methods")}
                            </p>
                            <p className="text-gray-400">
                                {t("payment_details")}
                            </p>

                            <form className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {createOrderMutation.isPending ? (
                                    <Loader />
                                ) : (
                                    <>
                                        {/* Conditionally render Bunna Bank option */}
                                        {userData?.bank?.id === 22 &&
                                            userData?.loan_balance > 0 && (
                                                <div
                                                    className="relative hover:cursor-pointer hover:bg-gray-50 hover:text-primary"
                                                    key={bunnaBank.id}
                                                >
                                                    <input
                                                        className="peer hidden"
                                                        id={`radio_${bunnaBank.id}`}
                                                        type="radio"
                                                        name="radio"
                                                        value={bunnaBank.id}
                                                        onChange={() =>
                                                            handlePaymentChange(
                                                                bunnaBank.id
                                                            )
                                                        }
                                                        checked={
                                                            paymentOptionId ===
                                                            bunnaBank.id
                                                        }
                                                    />
                                                    <span className="peer-checked:border-primary absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                                                    <label
                                                        className="peer-checked:border-2 peer-checked:border-primary peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 py-6 px-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary"
                                                        htmlFor={`radio_${bunnaBank.id}`}
                                                    >
                                                        <div className="flex flex-col items-center space-x-5">
                                                            <img
                                                                className="w-full h-20 object-contain object-center"
                                                                src={
                                                                    bunnaBank.image
                                                                }
                                                                alt={
                                                                    bunnaBank.name
                                                                }
                                                            />
                                                            <div className="ml-5 justify-start">
                                                                <span className="mt-2 font-semibold text-center text-sm">
                                                                    {t(
                                                                        "your_loan_balance"
                                                                    )}{" "}
                                                                    {
                                                                        userData?.loan_balance
                                                                    }{" "}
                                                                    {t("birr")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                        {paymentOptions.map((item) => (
                                            <div
                                                className={`relative hover:cursor-pointer hover:border-primary hover:border-2 border-gray-200 border-2 hover:text-primary ${item.backroundColor} rounded-lg`}
                                                key={item.id}
                                            >
                                                <input
                                                    className="peer hidden"
                                                    id={`radio_${item.id}`}
                                                    type="radio"
                                                    name="radio"
                                                    value={item.id}
                                                    onChange={() =>
                                                        handlePaymentChange(
                                                            item.id
                                                        )
                                                    }
                                                    checked={
                                                        paymentOptionId ===
                                                        item.id
                                                    }
                                                />
                                                <span className="peer-checked:border-primary absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                                                <label
                                                    className={`peer-checked:border-2 peer-checked:border-primary peer-checked:${item.backroundColor} flex cursor-pointer select-none rounded-lg border border-gray-200 py-6 px-2 text-sm font-medium text-gray-900  hover:text-primary`}
                                                    htmlFor={`radio_${item.id}`}
                                                >
                                                    <div className="flex flex-col items-center space-x-5">
                                                        <img
                                                            className="w-full h-20 object-contain object-center"
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                        <div className="ml-5 justify-start">
                                                            {/* <span className="mt-2 font-semibold">
                                                                {item.name}
                                                            </span> */}
                                                        </div>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}

                                        {/* Conditionally render No Bank option */}
                                        {userData?.bank?.id !== 22 &&
                                            (userData?.loan_balance ?? 0) >
                                                0 && (
                                                <div
                                                    className="relative hover:cursor-pointer hover:bg-gray-50 hover:text-primary"
                                                    key={noBank.id}
                                                >
                                                    <input
                                                        className="peer hidden"
                                                        id={`radio_${noBank.id}`}
                                                        type="radio"
                                                        name="radio"
                                                        value={noBank.id}
                                                        onChange={() =>
                                                            handlePaymentChange(
                                                                noBank.id
                                                            )
                                                        }
                                                        checked={
                                                            paymentOptionId ===
                                                            noBank.id
                                                        }
                                                    />
                                                    <span className="peer-checked:border-primary absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                                                    <label
                                                        className="peer-checked:border-2 peer-checked:border-primary peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 py-6 px-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary"
                                                        htmlFor={`radio_${noBank.id}`}
                                                    >
                                                        <div className="flex flex-col items-center space-x-5">
                                                            <img
                                                                className="w-full h-14 object-contain object-center"
                                                                src={
                                                                    noBank.image
                                                                }
                                                                alt={
                                                                    noBank.name
                                                                }
                                                            />
                                                            <div className="ml-5 justify-start  text-center text-[12px]">
                                                                <span className="mt-0.5 font-semibold">
                                                                    {t(
                                                                        "your_loan_balance"
                                                                    )}{" "}
                                                                    {
                                                                        userData?.loan_balance
                                                                    }{" "}
                                                                    {t("birr")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </label>
                                                </div>
                                            )}
                                    </>
                                )}
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                            <p className="text-xl font-medium">
                                {t("order_summary")}
                            </p>
                            <p className="text-gray-400 line-clamp-1">
                                {t("order_summary_check")}
                            </p>
                            <div className="mt-4 space-y-3 rounded-lg overflow-y-auto border max-h-72 bg-white px-2 py-4 sm:px-6">
                                {/* Cart Items */}
                                <div className="border-b border-gray-200">
                                    {cartItems.items.map((item) => (
                                        <Link
                                            to={`/products/${item.id}`}
                                            key={item.id}
                                            className="flex hover:text-primary hover:cursor-pointer flex-row rounded-lg bg-white sm:flex-row"
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
                                                    {t("quantity")}{" "}
                                                    {item.quantity}
                                                </span>
                                                <p className="text-lg font-bold">
                                                    <PriceFormatter
                                                        price={item.price.toString()}
                                                    />
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
                                                {t("quantity")} {item.quantity}
                                            </span>
                                            <p className="text-lg font-bold">
                                                <PriceFormatter
                                                    price={item.price.toString()}
                                                />
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
                                                className={`flex hover:text-primary hover:cursor-pointer flex-col rounded-lg bg-white sm:flex-row ${
                                                    selectedDiscount?.id ===
                                                    item.id
                                                        ? "bg-gray-100"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleDiscountSelect(item)
                                                }
                                            >
                                                <div className="flex w-full flex-col px-4 py-4">
                                                    <span className="font-semibold">
                                                        {item.name}
                                                    </span>
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
                                        <PriceFormatter
                                            price={subtotal.toString()}
                                        />
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
                                                <PriceFormatter
                                                    price={shipping.toString()}
                                                />
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
                                    <PriceFormatter
                                        price={grandTotal.toString()}
                                    />
                                </p>
                            </div>
                            <button
                                className="mt-4 mb-8 w-full rounded-lg bg-septenary text-white hover:bg-white hover:text-septenary border border-septenary transition-colors duration-300 px-6 py-3 font-medium  disabled:cursor-not-allowed disabled:opacity-50 "
                                onClick={handleOrderSubmit}
                                disabled={
                                    createOrderMutation.isPending ||
                                    paymentOptionId === null
                                }
                            >
                                {createOrderMutation.isPending
                                    ? t("processing")
                                    : t("buy_now")}
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
                                    <p className="logo-english">
                                        SeregelaGebeya
                                    </p>
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
                                <div className="text-sm">
                                    {t("order_id")}: {orderId}
                                </div>
                            </div>
                        </div>
                        <div className="border-b-2 border-gray-300 pb-8 mb-8">
                            <h2 className="text-2xl text-gray-700 font-bold mb-4">
                                {userData?.first_name} {userData?.last_name}
                            </h2>
                            <div className="text-gray-700 mb-2">
                                {userData?.user_name}
                            </div>
                            <div className="text-gray-700 mb-2">
                                {userData?.phone_number}
                            </div>
                            <div className="text-gray-700 mb-2">
                                {userData?.address?.city || ""},{" "}
                                {userData?.address?.sub_city || ""},{" "}
                                {userData?.address?.woreda || ""}
                            </div>
                            <div className="text-gray-700">
                                {userData?.email}
                            </div>
                        </div>
                        <table className="w-full  mb-8 ">
                            <thead>
                                <tr>
                                    <th className="text-gray-700 text-left font-bold uppercase py-2">
                                        {t("products")}
                                    </th>
                                    <th className="text-gray-700 text-center font-bold uppercase py-2">
                                        {t("quantity")}
                                    </th>
                                    <th className="text-gray-700 text-center font-bold uppercase py-2">
                                        {t("unit_price")}
                                    </th>
                                    <th className="text-gray-700 text-end font-bold uppercase py-2">
                                        {t("total_price")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderReturn?.products &&
                                    orderReturn?.products?.map(
                                        (product: any) => (
                                            <tr key={product.id}>
                                                <td className="py-4 text-left text-gray-700 line-clamp-1">
                                                    {product.name}
                                                </td>
                                                <td className="py-4 text-center text-gray-700">
                                                    {product.pivot.quantity}
                                                </td>
                                                <td className="py-4 text-center text-gray-700">
                                                    <PriceFormatter
                                                        price={product.price.toString()}
                                                    />{" "}
                                                </td>
                                                <td className="py-4 text-end text-gray-700">
                                                    <PriceFormatter
                                                        price={(
                                                            product.price *
                                                            product.pivot
                                                                .quantity
                                                        ).toString()}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}

                                {orderReturn?.packages &&
                                    orderReturn?.packages?.map(
                                        (product: any) => (
                                            <tr key={product.id}>
                                                <td className="py-4 text-left text-gray-700 line-clamp-1">
                                                    {product.name}
                                                </td>
                                                <td className="py-4 text-center text-gray-700">
                                                    {product.pivot.quantity}
                                                </td>
                                                <td className="py-4 text-center text-gray-700">
                                                    <PriceFormatter
                                                        price={product.price.toString()}
                                                    />{" "}
                                                </td>
                                                <td className="py-4 text-end text-gray-700">
                                                    <PriceFormatter
                                                        price={(
                                                            product.price *
                                                            product.pivot
                                                                .quantity
                                                        ).toString()}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    )}
                            </tbody>
                        </table>
                        <div className="flex justify-end mb-8">
                            <div className="text-gray-700 mr-2">
                                {t("sub_total")}:
                            </div>
                            <div className="text-gray-700">
                                <PriceFormatter
                                    price={orderReturn?.order_cost.toString()}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mb-8">
                            <div className="text-gray-700 mr-2">
                                {t("delivery")}:
                            </div>
                            <div className="text-gray-700">
                                {orderReturn?.delivery_cost === 0 ? (
                                    <span className="font-semibold text-green-600">
                                        {t("free")}
                                    </span>
                                ) : (
                                    <PriceFormatter
                                        price={orderReturn?.delivery_cost.toString()}
                                    />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mb-8">
                            <div className="text-gray-700 mr-2">
                                {t("total_price")}:
                            </div>
                            <div className="text-gray-700 font-bold text-xl">
                                <PriceFormatter
                                    price={orderReturn?.total_cost.toString()}
                                />
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
                <div className="mx-auto  bg-white pb-6 pt-3 ">
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
            {showApprove === 3 && <PinComponent order={orderForPin} />}
        </>
    );
};

export default Payment;
