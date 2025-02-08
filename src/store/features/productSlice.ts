import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Product } from "../../types/product";

interface ProductState {
    products: Product[];
    maxItems: number;
}

const loadState = (): ProductState => {
    try {
        const serializedState = localStorage.getItem("recentProducts");
        if (serializedState === null) {
            return {
                products: [],
                maxItems: 18,
            };
        }
        return JSON.parse(serializedState);
    } catch (err: any) {
        console.error(err);
        return {
            products: [],
            maxItems: 18,
        };
    }
};

const initialState: ProductState = loadState();

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addRecentProduct: (state, action: PayloadAction<Product>) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload.id
            );

            state.products.unshift(action.payload);

            if (state.products.length > state.maxItems) {
                state.products = state.products.slice(0, state.maxItems);
            }

            // Save to localStorage
            localStorage.setItem("recentProducts", JSON.stringify(state));
        },
        clearRecentProducts: (state) => {
            state.products = [];
            // Clear localStorage
            localStorage.removeItem("recentProducts");
        },
    },
});

// Export actions
export const { addRecentProduct, clearRecentProducts } = productSlice.actions;

// Export selector
export const selectRecentProducts = (state: RootState) =>
    state.products.products;

// Export reducer
export default productSlice.reducer;
