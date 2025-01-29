export interface ShippingDetails {
  first_name: string;
  last_name: string;
  phone_number: string;
  city: string;
  woreda: string;
  sub_city: string;
  neighborhood: string;
  house_number: string;
  latitude: number;
  longitude: number;
}
export interface PaymentDetails {
  [key: number]: string;
}

export interface DiscountType {
  id: number;
  name: string;
  name_am: string;
  description: string;
  description_am: string;
  discount: number;
}
export interface DeliveryType {
  id: number;
  slug: string;
  name: string;
  name_am: string;
  description: string;
  description_am: string;
  minimum_order_cost: number;
  delivery_cost_ranges: Array<any>;
  number_of_days: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  price: number;
  payment_percentage: number;
}

export interface OrderDetail {
  delivery_type_id: number;
  payment_method: string;
  shipping_detail: ShippingDetails | null;
  products: { id: number; quantity: number }[];
  packages: { id: number; quantity: number }[];
  discount_type_id?: number;
  pin_code?: string;
}

export type ApiResponse = {
  [key: string]: OrderDetails;
};

export type OrderDetails = {
  id: number;
  status: string;
  user_id: number;
  total_cost: number;
  order_cost: number;
  discounted_cost: number;
  delivery_cost: number;
  delivery_type_id: number;
  discount_type_id: number | null;
  discount_type_name: string | null;
  discount_percentage: number | null;
  days_left_for_delivery: number;
  delivery_type: DeliveryTypes;
  store_id: number | null;
  additional_order_payment: number | null;
  estimated_delivery_cost: number | null;
  estimated_delivery_time: string | null;
  actual_delivery_cost: number | null;
  actual_delivery_time: string | null;
  acceptor_id: number | null;
  acceptor: string | null;
  approver_id: number | null;
  approver: string | null;
  trip_search_id: number | null;
  otp: string | null;
  payment_method: string;
  additional_payment_method: string | null;
  products: Products[];
  packages: any[];
  invoice: Invoice | null;
  orderInvoices: Invoice[];
  deliveryInvoice: Invoice | null;
  shipping_detail: ShippingDetail;
  created_at: string;
  accepted_at: string | null;
  approved_at: string | null;
  delivered_at: string | null;
  deleted_at: string | null;
};

type DeliveryTypes = {
  id: number;
  slug: string;
  name: string;
  name_am: string;
  description: string;
  description_am: string;
  price: number;
  payment_percentage: number;
  number_of_days: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  minimum_order_cost: number;
};

type Products = {
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
  max_quantity_per_order: number | null;
  category_id: number | null;
  pivot: Pivot;
  subcategory_id: number;
  total_quantity: number;
  left_in_stock: number;
  rating: number | null;
  is_non_stocked: number;
  is_active: number;
  image_paths: string[];
  thumbnail_image_paths: string[];
  created_at: string;
  updated_at: string;
};

type Pivot = {
  order_id: number;
  product_id: number;
  id: number;
  quantity: number;
  store_id: number | null;
};

type Invoice = {
  id: string;
  order_id: number;
  type: string;
  description: string;
  payment_method: string;
  bank_transaction_id: string | null;
  bunna_bank_transaction_id: string | null;
  bunna_bank_reference_id: string | null;
  bunna_bank_transaction_date: string | null;
  telebirr_to_pay_url: string | null;
  telebirr_transaction_no: string | null;
  apollo_transaction_no: string | null;
  telebirr_super_prepay_id: string | null;
  telebirr_super_merch_order_id: string | null;
  telebirr_super_sign: string | null;
  telebirr_super_pre_order_response: string | null;
  telebirr_super_notification: string | null;
  telebirr_super_pay_request: string | null;
  telebirr_super_pay_order_request: string | null;
  cbe_transaction_no: string | null;
  hibret_transaction_no: string | null;
  cbe_birr_response: string | null;
  cbe_birr_result_response: CbeBirrResultResponse | null;
  cbe_birr_conversation_id: string | null;
  cbe_birr_transaction_id: string | null;
  cbe_pay_response: string | null;
  cbe_pay_refund_response: string | null;
  cbe_pay_status_check_response: string | null;
  cbe_pay_checkout_id: string | null;
  cbe_pay_payment_id: string | null;
  boa_request_parameters: string | null;
  boa_notification: string | null;
  boa_result_message: string | null;
  boa_request_response: string | null;
  hello_cash_response: string | null;
  hello_cash_invoice_id: string | null;
  hello_cash_last_webhook_response: string | null;
  awash_wallet_transaction_id: string | null;
  awash_wallet_initiation_response: string | null;
  awash_wallet_result_response: string | null;
  enat_bank_conversation_id: string | null;
  enat_bank_acknowledgement_id: string | null;
  enat_bank_notification: string | null;
  eth_switch_order_id: string | null;
  hello_cash_paying_phone_number: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
  deleted_at: string | null;
  payment_amount: number;
};

type CbeBirrResultResponse = {
  code: string;
  type: string;
  description: string;
  transaction_id: string;
};

type ShippingDetail = {
  id: number;
  order_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  city: string;
  sub_city: string;
  woreda: string;
  neighborhood: string;
  phone_number: string;
  house_number: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  longitude: string;
  latitude: string;
};
