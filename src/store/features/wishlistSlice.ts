import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';

export interface WishlistItem
    extends Pick<
        Product,
        'id' | 'name' | 'price' | 'image_paths' | 'left_in_stock'
    > {
    id: number;
    price: string;
    image_paths: string[];
    quantity: number;
}

interface WishlistState {
    items: WishlistItem[];
}

// Load initial state from localStorage
const loadState = (): WishlistState => {
    try {
        const serializedState = localStorage.getItem('wishlist');
        if (serializedState === null) {
            return { items: [] };
        }
        const parsedState = JSON.parse(serializedState);
        return {
            items: Array.isArray(parsedState.items) ? parsedState.items : [],
        };
    } catch (err) {
        console.error(err);
        return { items: [] };
    }
};

const initialState: WishlistState = loadState();

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlistItem: (state, action: PayloadAction<WishlistItem>) => {
            if (!state.items) {
                state.items = [];
            }
            const index = state.items.findIndex(
                (item) => item.id === action.payload.id
            );
            if (index === -1) {
                state.items.push(action.payload);
            } else {
                state.items.splice(index, 1);
            }
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        removeFromWishlist: (state, action: PayloadAction<number>) => {
            if (!state.items) {
                state.items = [];
                return;
            }
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
        clearWishlist: (state) => {
            state.items = [];
            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(state));
        },
    },
});

export const { toggleWishlistItem, removeFromWishlist, clearWishlist } =
    wishlistSlice.actions;

export default wishlistSlice.reducer;
