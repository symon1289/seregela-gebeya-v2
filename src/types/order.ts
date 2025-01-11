export interface ShippingDetails {
  first_name: string,
  last_name: string,
  phone_number: string,
  city: string,
    woreda: string,
    sub_city: string,
    neighborhood: string,
    house_number: string,
    latitude: number,
    longitude: number,
}
export interface PaymentDetails {
  payment_method: string
}
 export interface DeliveryType {
   id: number,
   name: string,
      
      name_am: string,
      description: string,
      description_am: string,
      minimum_order_cost: number,
      delivery_cost_ranges: Array<any>,
      number_of_days: number
 }
 
export interface OrderDetail {
    delivery_type_id: number,
    payment_method: string,
    shipping_detail: ShippingDetails,
    products: { id: number; quantity: number }[],
    packages: { id: number; quantity: number }[],
    discount_type_id?: number,
    pin_code?: string
  }