import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import api from "../utils/axios";
import { OrderDetail, DeliveryType } from "../types/order";

// Utility function for auth headers
const getAuthHeader = () => {
    const token = window.localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// Query functions
export const fetchDeliveryTypes = async (): Promise<DeliveryType[]> => {
    const { data } = await api.get("delivery-types", getAuthHeader());
    return data.data;
};

const createOrder = async (order: OrderDetail) => {
    const { data } = await api.post("orders", order, getAuthHeader());
    return data.data;
};

const fetchOrders = async ({
    pageParam = 1,
    status,
    id,
    product_name,
    package_name,
}: {
    pageParam?: number;
    status?: string;
    id?: string;
    product_name?: string;
    package_name?: string;
}): Promise<{
    orders: OrderDetail[];
    nextPage: number;
    hasNextPage: boolean;
}> => {
    const { data } = await api.get("orders", {
        ...getAuthHeader(),
        params: {
            page: pageParam,
            status,
            id,
            product_name,
            package_name,
        },
    });

    return {
        orders: data.data,
        nextPage: data.meta.current_page + 1,
        hasNextPage: data.meta.current_page < data.meta.last_page,
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
export const useOrder = (filters: {
    status?: string;
    id?: string;
    product_name?: string;
    package_name?: string;
}) => {
    const deliveryTypesQuery = useQuery({
        queryKey: ["deliveryTypes"],
        queryFn: fetchDeliveryTypes,
    });

    const createOrderMutation = useMutation({
        mutationFn: createOrder,
    });

    const ordersQuery = useInfiniteQuery({
        queryKey: ["orders", filters],
        queryFn: ({ pageParam = 1 }) =>
            fetchOrders({
                pageParam,
                ...filters,
            }),
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

    const useOrderDetails = (
        orderId: string | undefined,
        options?: { enabled?: boolean }
    ) => {
        if (!orderId) {
            throw new Error("orderId is required");
        }
        return useQuery({
            queryKey: ["order", orderId] as const,
            queryFn: () => fetchOrderById(orderId),
            enabled: options?.enabled ?? true,
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
