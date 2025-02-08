export interface Address {
    city: string | null;
    sub_city: string | null;
    woreda: string | null;
    neighborhood: string | null;
    house_number: string | null;
    longitude: string;
    latitude: string;
}

interface Driver {
    id: number;
    user_name: string | null;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string;
    is_active: number;
    is_corporate_manager: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    profile_image_path: string | null;
    profile_thumbnail_path: string | null;
}

interface Store {
    id: number;
    name: string;
    type: string;
    address: Address;
    driver_id: number;
    driver: Driver;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export type PackageProduct = {
    id: number;
    cnet_id: string;
    name: string;
    name_am: string;
    slug: string | null;
    description: string | null;
    description_am: string | null;
    supplier_id: number;
    brand: string;
    size: string | null;
    measurement_type: string;
    weight: string;
    price: string;
    discount: string;
    max_quantity_per_order: string | null;
    category_id: string | null;
    pivot: {
        package_id: number;
        product_id: number;
        created_at: string;
        updated_at: string;
        id: number;
        quantity: number;
    };
    subcategory_id: number;
    stores: Store[];
    total_quantity: number;
    left_in_stock: number;
    rating: string | null;
    is_non_stocked: number;
    is_active: number;
    image_paths: string[];
    thumbnail_image_paths: string[];
    created_at: string;
    updated_at: string;
};

interface StoreProductPivot {
    quantity: number;
    enough_for_package: number;
}

interface StoreProduct {
    id: number;
    name: string;
    name_am: string;
    pivot: StoreProductPivot;
}

interface PackageStorePivot {
    quantity: number;
}

interface PackageStore {
    id: number;
    cnet_id: string;
    name: string;
    phone_number: string | null;
    type: string;
    driver_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    laravel_through_key: number;
    pivot: PackageStorePivot;
    products: StoreProduct[];
}

export interface Package {
    id: string;
    name: string;
    name_am: string;
    is_active: number;
    price: string;
    discount: string;
    max_quantity_per_order: number | null;
    stores: PackageStore[];
    total_quantity: number;
    left_in_stock: number;
    image_path: string;
    image_paths: string[];
    thumbnail_image_paths: string[];
    tag_id: number;
    products: PackageProduct[];
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    name: string;
    name_am: string | null;
    phone_number: string;
}

export interface Subcategory {
    id: number;
    name: string;
    name_am: string;
    category_id: number;
    image_path: string | null;
    products_count: number;
    created_at: string;
}

export interface Product {
    id: number;
    name: string;
    name_am: string | null;
    description: string | null;
    description_am: string | null;
    supplier: Supplier;
    brand: string;
    measurement_type: string;
    price: string;
    discount: string;
    category_id: number | null;
    category: any | null;
    subcategory: Subcategory | null;
    subcategory_id: number | null;
    stores: Store[];
    total_quantity: number;
    left_in_stock: number;
    image_paths: string[];
    image?: string;
    created_at: string;
    updated_at: string;
    rating: number | null;
    is_non_stocked: number;
    is_active: number;
    unit: string;
    originalPrice: string;
}

export interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    selectedProduct: Product | null;
}
