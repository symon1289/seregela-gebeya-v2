export type UserApiResponse = {
    data: UserData;
  };
  
  export type UserData = {
    id: number;
    user_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    email_verified_at: string | null;
    is_pin_updated: boolean;
    is_active: number;
    wallet_balance: number;
    corporate_id: number;
    bypass_product_quantity_restriction: number;
    bank: Bank;
    loan_balance: number;
    loan_granted: number;
    loan_used: number;
    created_at: string;
    deleted_at: string | null;
    profile_image_path: string | null;
    profile_thumbnail_path: string | null;
    address: Address;
  };
  
  export type Bank = {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    pivot: BankPivot;
  };
  
  export type BankPivot = {
    user_id: number;
    bank_id: number;
    created_at: string;
    updated_at: string;
    account_number: string;
    loan_cap: number;
    loan_balance: number;
    loan_granted: number;
    loan_used: number;
    id: string;
  };
  
  export type Address = {
    city: string;
    sub_city: string;
    woreda: string;
    neighborhood: string;
    house_number: string;
    longitude: string | null;
    latitude: string | null;
  };
  