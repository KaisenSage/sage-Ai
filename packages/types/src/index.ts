// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum OrderType {
  DINE_IN = 'DINE_IN',
  PICKUP = 'PICKUP',
  DELIVERY = 'DELIVERY',
  WALK_IN = 'WALK_IN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum StaffRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT'
}

// Base Types
export interface Business {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  logo?: string;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: any;
  phone: string;
  email: string;
  isActive: boolean;
  orderingEnabled: boolean;
  settings?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  images?: string[];
  isAvailable: boolean;
  preparationTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  priceModifier: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Addon {
  id: string;
  productId: string;
  name: string;
  price: number;
  isRequired: boolean;
  maxQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  email: string;
  phone: string;
  name: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  businessId: string;
  branchId: string;
  customerId: string;
  status: OrderStatus;
  orderType: OrderType;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
  tableNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface Staff {
  id: string;
  businessId: string;
  email: string;
  name: string;
  phone: string;
  role: StaffRole;
  permissions?: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: StaffRole;
    businessId: string;
  };
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface CreateProductRequest {
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  images?: string[];
  preparationTime?: number;
  variants?: { name: string; priceModifier: number }[];
  addons?: { name: string; price: number; isRequired: boolean; maxQuantity: number }[];
}

export interface UpdateProductRequest {
  categoryId?: string;
  name?: string;
  description?: string;
  basePrice?: number;
  images?: string[];
  isAvailable?: boolean;
  preparationTime?: number;
}

export interface CreateBranchRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  coordinates?: { lat: number; lng: number };
  settings?: any;
}

export interface UpdateBranchRequest {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
  orderingEnabled?: boolean;
  coordinates?: { lat: number; lng: number };
  settings?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
