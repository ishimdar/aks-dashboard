// src/types/Product.ts
export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  quantity: number;
  unit: string;
  imageUrl?: string;   // optional, backend may not always return
  imageFile?: File;    // optional, used only in frontend form
}
