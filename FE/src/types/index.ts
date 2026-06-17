export interface Category {
  categoryID: number;
  categoryName: string;
  categoryDescription: string;
  isActive: boolean;
}

export interface Product {
  productID: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryID: number;
  categoryName?: string;
  isActive: boolean;
  createdDate: string;
  modifiedDate?: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: string;
  expiresAt: string;
}

export interface ApiError {
  message: string;
}
