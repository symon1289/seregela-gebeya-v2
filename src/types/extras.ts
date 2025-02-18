import { Product } from "./product";

export interface SectionProps {
    title: string;
    products:
        | Pick<
              Product,
              | "id"
              | "name"
              | "price"
              | "image_paths"
              | "left_in_stock"
              | "originalPrice"
              | "image"
              | "discount"
              | "max_quantity_per_order"
          >[]
        | Product[];
    intervalTime: number;
    loading: boolean;
}
