export const getLeftInStock = (
    user: { bypass_product_quantity_restriction?: number } | null,
    product: { left_in_stock?: number; max_quantity_per_order?: number | null }
): number | undefined => {
    if (user?.bypass_product_quantity_restriction === 1) {
        return product.left_in_stock;
    }
    return product.max_quantity_per_order ?? product.left_in_stock;
};
