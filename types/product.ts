export interface ProductImage {
  id: string;
  imageUrl: string;
  productId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface VariantOption {
  id: string;
  variantId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  optionName: string;
  imageUrl: string | null;
  price: number;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  options: VariantOption[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceWithDiscount: number;
  storeId: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductsResponse {
  items: Product[];
}
