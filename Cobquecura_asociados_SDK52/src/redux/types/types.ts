export enum UserActionTypes {
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    REGISTER_SUCCESS = 'REGISTER_SUCCESS',
    REGISTER_FAILURE = 'REGISTER_FAILURE',
  }
  
  // Definición del tipo de estado del usuario
  export interface UserState {
    userData: UserData | {}; 
    loading: boolean; 
    error: string | null; 
  }
  export interface Category {
    category_id: number;
    name: string;
  }
  export interface UserCategory {
    id?: number;
    category_id?: number;
    name: string;
  }
  //EStados
  export interface Status {
    id: number;
    name: string;
    description: string | null;
  }
  //Funcionalidades
  export interface Functionality {
    id: number;
    name: string;
    description: string;
    platform: string;
  }
  //Roles
  export interface Role {
    role_id: number;
    role_name: string;
    functionalities: Functionality[];
  }
    //terminos
    export interface Terms {
      content: string;
      created_at: string;
      id: number;
      version: string;
    };
  // Definición de la estructura de los datos del usuario
  export interface UserData {
    user_id: number;
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    birth_date: string;
    email: string;
    phone_number: string;
    gender: string;
    image_url?: string | null;
    status?: Status;
    subscribed_to_newsletter: boolean;
    roles?: Role[];
    categories?: any;
    terms?: Terms | null;
    terms_accepted_at?: string; 
  }


  export interface LoginResponse {
    token: string;
    user: UserData;
  }
  export interface ImagePromotion {
    image_id: number;
    image_path: string;
    promotion_id: number;
  }
  export interface Promotion {
    promotion_id: number;
    title: string;
    description: string;
    start_date: string;
    expiration_date: string;
    qr_code: string;
    partner_id: number;
    categories: Category[];
    images: ImagePromotion[];
    discount_percentage?: number;
    branch_id: number ;
    available_quantity?: number;
    status?: Status;
    favorites?: any[];
    partner_details?: any;
  }
  export interface PromotionUpdate {
    promotion_id?: number;
    title: string;
    description: string;
    start_date: string;
    expiration_date: string;
    partner_id: number;
    category_ids: number[];
    images: ImagePromotionUpdate[];
    discount_percentage?: number;
    branch_id: number;
    available_quantity?: number;
  }
  export interface PromotionCreate {
    promotion_id?: number;
    title: string;
    description: string;
    start_date: string | null;
    expiration_date: string | null;
    partner_id: number;
    category_ids: number[];
    images: ImagePromotionUpdate[];
    discount_percentage?: number;
    branch_id: number;
    available_quantity?: number | null;
  }
  export interface PromotionConsumed {
    id: number;
    user_id: number;
    promotion_id: number;
    status_id: number;
    quantity_consumed: number;
    consumption_date: string;
    description?: string;
  }
  export interface ImagePromotionUpdate{
    filename: string;
    data:string
  }
  export interface Branch {
    branch_id: number;
    partner_id: number;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    status: Status;
    image_url: string;
  }
  export interface Favorite{
    created_at: string;
    promotion_id: number;
    user_id: number
  }

  export interface TouristPoint {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    images: {
      id: number;
      image_path: string;
    }[];
    average_rating: number | null;
  }
  export interface Rating {
    id: number ;
    comment: string;
    rating: number;
    tourist_id?: number;
    tourist_point_id: number;
    
  }
  export interface NewRating {
    comment: string;
    rating: number;
    tourist_id?: number;
  }
  export interface RatingBranch {
    id?: number ;
    user_id?:number;
    rating: number ;
    comment: string ;
    created_at?: string;
    first_name?:string;
  }
  export interface Country {
    code: string;      
    id: number; 
    name: string;
    phone_code: string;
  }
  export interface Partner {
    address: string;
    contact_info: string;
    business_type: string;
    category_ids: number[];
  }

  export interface PartnerData {
    address: string;
    branches: Array<{ branch_id: number; name: string; description: string; address: string }>;
    business_type: string;
    categories: Array<{ category_id: number; name: string }>;
    contact_info: string;
    user: UserData;
  }
  export interface UpdatePartnerPayload {
    address: string;
    contact_info: string;
    business_type: string;
    category_ids: number[];
  }