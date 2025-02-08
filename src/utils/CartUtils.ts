import { CartItem, CartPackage } from '../store/features/cartSlice';

/**
 * Calculate the subtotal of all items in the cart
 * @param items Array of cart items
 * @returns The subtotal amount
 */
export const calculateItemsSubtotal = (items: CartItem[]): number => {
    return items.reduce(
        (total, item) => total + parseFloat(item.price) * item.quantity,
        0
    );
};

/**
 * Calculate the subtotal of all packages in the cart
 * @param packages Array of cart packages
 * @returns The subtotal amount
 */
export const calculatePackagesSubtotal = (packages: CartPackage[]): number => {
    return packages.reduce(
        (total, pkg) => total + parseFloat(pkg.price) * pkg.quantity,
        0
    );
};

/**
 * Calculate the total subtotal of items and packages in the cart
 * @param items Array of cart items
 * @param packages Array of cart packages
 * @returns The total subtotal amount
 */
export const calculateSubtotal = (
    items: CartItem[],
    packages: CartPackage[]
): number => {
    const itemsSubtotal = calculateItemsSubtotal(items);
    const packagesSubtotal = calculatePackagesSubtotal(packages);
    return itemsSubtotal + packagesSubtotal;
};

/**
 * Calculate shipping cost based on subtotal
 * Free shipping for orders over 10,000 Birr
 * @param subtotal The subtotal amount
 * @returns The shipping cost
 */
export const calculateShipping = (subtotal: number): number => {
    return subtotal > 10000 ? 0 : 100;
};

/**
 * Calculate discount amount based on subtotal and any special conditions
 * Currently, a discount of 1,000 Birr is applied for orders over 100,000 Birr
 * @param subtotal The subtotal amount
 * @returns The discount amount
 */
export const calculateDiscount = (subtotal: number): number => {
    return subtotal > 100000 ? 1000 : 0;
};

/**
 * Calculate the grand total including subtotal, shipping, and discount
 * @param items Array of cart items
 * @param packages Array of cart packages
 * @returns Object containing all price calculations
 */
export const calculateCartTotals = (
    items: CartItem[],
    packages: CartPackage[]
) => {
    const subtotal = calculateSubtotal(items, packages);
    const shipping = calculateShipping(subtotal);
    const discount = calculateDiscount(subtotal);
    const grandTotal = subtotal - discount + shipping;

    return {
        subtotal,
        shipping,
        discount,
        grandTotal,
        freeShipping: shipping === 0,
    };
};
