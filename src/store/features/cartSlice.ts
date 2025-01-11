import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Package } from '../../types/product';
import { PaymentDetails, ShippingDetails } from '../../types/order';



export interface CartItem extends Pick<Product, 'name' | 'left_in_stock'> {
  id: number;
  price: string;
  image_paths: string[];
  quantity: number;
}

export interface CartPackage extends Pick<Package, 'name' | 'left_in_stock'> {
  id: number;
  price: string;
  image_path: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  packages: CartPackage[];
  shippingDetails: ShippingDetails | null;
  paymentDetails: PaymentDetails | null;
  delivery_type_id: number | null;
}

// Load initial state from localStorage and ensure proper types
const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cart');
    if (serializedState === null) {
      return { items: [], packages: [], shippingDetails: null, paymentDetails: null, delivery_type_id: null };
    }
    const parsedState = JSON.parse(serializedState);

    // Transform the loaded items to match CartItem interface
    const transformedItems = Array.isArray(parsedState.items)
      ? parsedState.items.map((item: CartItem) => ({
          ...item,
          id: Number(item.id), // Ensure id is number
          price: String(item.price), // Ensure price is string
          image_paths: item.image_paths || [], // Ensure image_paths exists
          left_in_stock: item.left_in_stock || 0, // Ensure left_in_stock exists
        }))
      : [];

    // Transform the loaded packages to match CartPackage interface
    const transformedPackages = Array.isArray(parsedState.packages)
      ? parsedState.packages.map((pkg: CartPackage) => ({
          ...pkg,
          id: Number(pkg.id), // Ensure id is number
          price: String(pkg.price), // Ensure price is string
          image_path: pkg.image_path || '', // Ensure image_path exists
          left_in_stock: pkg.left_in_stock || 0, // Ensure left_in_stock exists
        }))
      : [];

    return {
      items: transformedItems,
      packages: transformedPackages,
      shippingDetails: parsedState.shippingDetails,
      paymentDetails: parsedState.paymentDetails,
      delivery_type_id: parsedState.deliveryType,
    };
  } catch (err) {
    console.error(err);
    return { items: [], packages: [], shippingDetails: null, paymentDetails: null, delivery_type_id: null };
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          id: Number(action.payload.id),
          price: String(action.payload.price),
          image_paths: action.payload.image_paths || [],
          left_in_stock: action.payload.left_in_stock || 0,
        });
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    addPackageToCart: (state, action: PayloadAction<CartPackage>) => {
      const existingPackage = state.packages.find((pkg) => pkg.id === action.payload.id);
      if (existingPackage) {
        existingPackage.quantity += action.payload.quantity;
      } else {
        state.packages.push({
          ...action.payload,
          id: Number(action.payload.id),
          price: String(action.payload.price),
          image_path: action.payload.image_path || '',
          left_in_stock: action.payload.left_in_stock || 0,
        });
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removePackageFromCart: (state, action: PayloadAction<number>) => {
      state.packages = state.packages.filter((pkg) => pkg.id !== action.payload);
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    updatePackageQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const pkg = state.packages.find((pkg) => pkg.id === action.payload.id);
      if (pkg) {
        pkg.quantity = action.payload.quantity;
      }
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingDetails: (state, action: PayloadAction<ShippingDetails>) => {
      state.shippingDetails = action.payload;
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action: PayloadAction<PaymentDetails>) => {
      state.paymentDetails = action.payload;
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveDeliveryType: (state, action: PayloadAction<number>) => {
      state.delivery_type_id = action.payload;
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.packages = [];
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  addPackageToCart,
  removeFromCart,
  removePackageFromCart,
  updateQuantity,
  updatePackageQuantity,
  saveShippingDetails,
  savePaymentMethod,
  saveDeliveryType,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;