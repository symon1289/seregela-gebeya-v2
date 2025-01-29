
export interface ProductForGrid {
  id: number;
  name: string;
  name_am: string;
  oldPrice?: string;
  newPrice: string;
  image: string[];
  left_in_stock?: number;
}

export interface SectionProps {
  title: string;
  products: ProductForGrid[];
  intervalTime: number;
  loading: boolean;
}
