import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIOrderResponse } from "../../types/orderResponse";

interface ReceiptState {
    receipt?: APIOrderResponse;
}

const loadState = (): ReceiptState => {
    try {
        const serializedState = localStorage.getItem("cart");
        if (serializedState === null) {
            return { receipt: undefined };
        }
        const parsedState = JSON.parse(serializedState);

        // Transform the loaded items to match CartItem interface
        const transformedReceipt = Array.isArray(parsedState.receipt)
            ? parsedState.receipt
            : [];

        return {
            receipt: transformedReceipt,
        };
    } catch (err) {
        console.error(err);
        return { receipt: undefined };
    }
};

const initialState: ReceiptState = loadState();

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setReceipt: (state, action: PayloadAction<APIOrderResponse>) => {
            state.receipt = action.payload;
            localStorage.setItem("receipt", JSON.stringify(state));
        },
        removeReceipt: (state) => {
            state.receipt = undefined;
            localStorage.removeItem("receipt");
        },
    },
});

export const { setReceipt, removeReceipt } = orderSlice.actions;

export default orderSlice.reducer;
