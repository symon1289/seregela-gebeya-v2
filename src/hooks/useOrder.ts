import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import api from "../utils/axios";
import { OrderDetail, DeliveryType } from "../types/order";

// Utility function for auth headers
const getAuthHeader = () => ({
  headers: {
    Authorization: "Bearer " + window.localStorage.getItem("token"),
  },
});

// Query functions
const fetchDeliveryTypes = async (): Promise<DeliveryType[]> => {
  const { data } = await api.get("delivery-types", getAuthHeader());
  return data.data;
};

const createOrder = async (order: OrderDetail) => {
  const { data } = await api.post("orders", order, getAuthHeader());
  return data.data;
};

const fetchOrders = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const { data } = await api.get("orders", {
    ...getAuthHeader(),
    params: { page: pageParam },
  });
  return {
    orders: data.data,
    nextPage: data.meta.current_page + 1,
    hasNextPage: data.meta.current_page < data.meta.last_page,
    lastPage: data.meta.last_page,
  };
};

const fetchOrderByStatus = async (status: string) => {
  const { data } = await api.get("orders", {
    ...getAuthHeader(),
    params: { status },
  });
  return data.data;
};

const fetchOrderById = async (orderId: string) => {
  const { data } = await api.get(`orders/${orderId}`, getAuthHeader());
  return data.data;
};

const makePayment = async (orderId: string) => {
  const { data } = await api.post(
    `orders/${orderId}/make-payment`,
    {},
    getAuthHeader()
  );
  return data;
};

const makePaymentWithOTP = async ({
  orderId,
  otp,
}: {
  orderId: string;
  otp: string;
}) => {
  const { data } = await api.post(
    `orders/${orderId}/make-payment`,
    { otp },
    getAuthHeader()
  );
  return data.data;
};

const resendOTP = async (orderId: string) => {
  const { data } = await api.post(
    `orders/${orderId}/resend-otp`,
    {},
    getAuthHeader()
  );
  return data;
};

const cancelOrder = async (orderId: string) => {
  const { data } = await api.post(
    `orders/${orderId}/cancel`,
    {},
    getAuthHeader()
  );
  return data;
};

const checkCBE = async (checkoutID: string) => {
  const { data } = await api.post(
    `orders/${checkoutID}/check-and-update-payment`,
    {},
    getAuthHeader()
  );
  return data.data;
};

const fetchDiscounts = async () => {
  const { data } = await api.get("discount-types", getAuthHeader());
  return data.data;
};

// Custom hooks
export const useOrder = () => {
  const deliveryTypesQuery = useQuery({
    queryKey: ["deliveryTypes"],
    queryFn: fetchDeliveryTypes,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
  });

  const ordersQuery = useInfiniteQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
  });

  const useOrdersByStatus = (status: string | undefined) => {
    if (!status) {
      throw new Error("status is required");
    }
    return useQuery({
      queryKey: ["order", status] as const,
      queryFn: () => fetchOrderByStatus(status),
      enabled: true,
    });
  };

  const useOrderDetails = (orderId: string | undefined) => {
    if (!orderId) {
      throw new Error("orderId is required");
    }
    return useQuery({
      queryKey: ["order", orderId] as const,
      queryFn: () => fetchOrderById(orderId),
      enabled: true,
    });
  };
  const makePaymentMutation = useMutation({
    mutationFn: makePayment,
  });

  const makePaymentWithOTPMutation = useMutation({
    mutationFn: makePaymentWithOTP,
  });

  const resendOTPMutation = useMutation({
    mutationFn: resendOTP,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
  });

  const checkCBEMutation = useMutation({
    mutationFn: checkCBE,
  });

  const discountsQuery = useQuery({
    queryKey: ["discountTypes"],
    queryFn: fetchDiscounts,
  });

  return {
    deliveryTypesQuery,
    createOrderMutation,
    ordersQuery,
    useOrdersByStatus,
    useOrderDetails,
    makePaymentMutation,
    makePaymentWithOTPMutation,
    resendOTPMutation,
    cancelOrderMutation,
    checkCBEMutation,
    discountsQuery,
  };
};

export default useOrder;
