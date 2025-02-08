import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';
import productsReducer from './features/productSlice';
import languageReducer from './features/languageSlice';
import authReducer from './features/authSlice';
import orderSlice from './features/orderSlice';
export const store = configureStore({
    reducer: {
        cart: cartReducer,
        wishlist: wishlistReducer,
        products: productsReducer,
        language: languageReducer,
        auth: authReducer,
        order: orderSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
