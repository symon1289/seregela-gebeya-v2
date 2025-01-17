import { useState } from "react";
import api from "../utils/axios";
import { OrderDetail } from "../types/order"


interface UseOrderReturn {
  loading: boolean;
  error: string | null;
  getDeliveryTypes: () => Promise<any>;
  makeOrder: (order:  OrderDetail) => Promise<any>;
  makeOrderPin: (order:  OrderDetail) => Promise<any>;
  getOrders: () => Promise<any>;
  getUserOrderByStatus: (status: string) => Promise<any>;
  getUserOrderById: (orderId: string) => Promise<any>;
  makePayment: (orderId: string) => Promise<any>;
  makePaymentOTP: (orderId: string, otp: string) => Promise<any>;
  resendLoanOTP: (orderId: string) => Promise<any>;
  cancelOrder: (orderId: string) => Promise<any>;
  checkCBE: (checkoutID: string) => Promise<any>;
  getDiscounts: () => Promise<any>;
}

const useOrder = (): UseOrderReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (request: () => Promise<any>): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const data = await request();
      setLoading(false);
      return data;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "An error occurred");
      throw err;
    }
  };

  const getDeliveryTypes = async () =>
    handleRequest(() => api.get("delivery-types").then((res) => res.data.data));

  const makeOrder = async (order:  OrderDetail) =>
    handleRequest(() =>
      api
        .post(
          "orders",
          {
            payment_method: order.payment_method,
            delivery_type_id: order.delivery_type_id,
            shipping_detail: order.shipping_detail,
            discount_type_id: order.discount_type_id,
            products: order.products,
            packages: order.packages,
          },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data.data)
    );

  const makeOrderPin = async (order:  OrderDetail) =>
    handleRequest(() =>
      api
        .post(
          "orders",
          {
            payment_method: order.payment_method,
            delivery_type_id: order.delivery_type_id,
            shipping_detail: order.shipping_detail,
            discount_type_id: order.discount_type_id,
            products: order.products,
            packages: order.packages,
            pin_code: order.pin_code,
          },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data.data)
    );

  const getOrders = async () =>
    handleRequest(() =>
      api
        .get(`orders?page=2`, {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem("token"),
          },
        })
        .then((res) => res.data.data)
    );

  const getUserOrderByStatus = async (status: string) =>
    handleRequest(() =>
      api
        .get("orders", {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem("token"),
          },
          params: { status },
        })
        .then((res) => res.data.data)
    );

  const getUserOrderById = async (orderId: string) =>
    handleRequest(() =>
      api
        .get(`orders/${orderId}`, {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem("token"),
          },
        })
        .then((res) => res.data.data)
    );

  const makePayment = async (orderId: string) =>
    handleRequest(() =>
      api
        .post(
          `orders/${orderId}/make-payment`,
          {},
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data)
    );

  const makePaymentOTP = async (orderId: string, otp: string) =>
    handleRequest(() =>
      api
        .post(
          `orders/${orderId}/make-payment`,
          { otp },
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data.data)
    );

  const resendLoanOTP = async (orderId: string) =>
    handleRequest(() =>
      api
        .post(
          `/orders/${orderId}/resend-otp`,
          {},
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data)
    );

  const cancelOrder = async (orderId: string) =>
    handleRequest(() =>
      api
        .post(
          `orders/${orderId}/cancel`,
          {},
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data)
    );

  const checkCBE = async (checkoutID: string) =>
    handleRequest(() =>
      api
        .post(
          `orders/${checkoutID}/check-and-update-payment`,
          {},
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        )
        .then((res) => res.data.data)
    );

  const getDiscounts = async () =>
    handleRequest(() =>
      api
        .get("discount-types", {
          headers: {
            Authorization: "Bearer " + window.localStorage.getItem("token"),
          },
        })
        .then((res) => res.data.data)
    );

  return {
    loading,
    error,
    getDeliveryTypes,
    makeOrder,
    makeOrderPin,
    getOrders,
    getUserOrderByStatus,
    getUserOrderById,
    makePayment,
    makePaymentOTP,
    resendLoanOTP,
    cancelOrder,
    checkCBE,
    getDiscounts,
  };
};

export default useOrder;
