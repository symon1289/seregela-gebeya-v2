import { CartItem, CartPackage } from "../store/features/cartSlice";
import { DeliveryType } from "../types/order";
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
 * Calculate shipping cost based on subtotal and a specific delivery type ID
 * @param subtotal The subtotal amount
 * @param deliveryTypes Delivery types fetched from the API
 * @param selectedDeliveryTypeId The ID of the selected delivery type
 * @returns The shipping cost
 */
export const calculateShipping = (
    subtotal: number,
    deliveryTypes?: DeliveryType[],
    selectedDeliveryTypeId?: number
): number => {
    if (!deliveryTypes || deliveryTypes.length === 0) {
        // Default to a fixed shipping cost if no delivery types are available
        return subtotal > 2999.99 ? 0 : 300;
    }

    if (selectedDeliveryTypeId === undefined) {
        // If no delivery type ID is provided, default to the first available delivery type
        const defaultDeliveryType = deliveryTypes[0];
        if (!defaultDeliveryType) {
            return subtotal > 2999.99 ? 0 : 300;
        }
        selectedDeliveryTypeId = defaultDeliveryType.id;
    }

    // Find the selected delivery type by ID
    const selectedDeliveryType = deliveryTypes.find(
        (type) => type.id === selectedDeliveryTypeId
    );

    if (!selectedDeliveryType) {
        // If the selected delivery type is not found, default to a fixed cost
        return subtotal > 2999.99 ? 0 : 300;
    }

    const { minimum_order_cost, delivery_cost_ranges } = selectedDeliveryType;
    // Check if the subtotal meets the minimum order cost for the selected delivery type
    if (subtotal < minimum_order_cost) {
        return subtotal > 2999.99 ? 0 : 300; // Fallback to default shipping logic
    }

    // Find the matching range in the delivery cost ranges
    const matchingRange = delivery_cost_ranges.find(
        ({ start, end }) =>
            subtotal >= start && (end === null || subtotal <= end)
    );

    if (!matchingRange) {
        return subtotal > 2999.99 ? 0 : 300;
    }

    const { cost_percentage } = matchingRange;

    // Calculate the shipping cost based on the cost percentage
    if (cost_percentage === 0) {
        return 0; // Free shipping
    }

    return cost_percentage;
};

/**
 * Calculate discount amount based on subtotal and any special conditions
 * Currently, a discount of 0 Birr is applied for orders over 100,000 Birr
 * @param subtotal The subtotal amount
 * @returns The discount amount
 */
export const calculateDiscount = (subtotal: number): number => {
    return subtotal > 100000 ? 0 : 0;
};

/**
 * Calculate the grand total including subtotal, shipping, and discount
 * @param items Array of cart items
 * @param packages Array of cart packages
 * @returns Object containing all price calculations
 */
export const calculateCartTotals = (
    items: CartItem[],
    packages: CartPackage[],
    deliveryTypes?: DeliveryType[],
    selectedDeliveryTypeId?: number
) => {
    const subtotal = calculateSubtotal(items, packages);
    const shipping = calculateShipping(
        subtotal,
        deliveryTypes,
        selectedDeliveryTypeId
    );
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
