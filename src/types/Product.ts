// src/types/Product.ts
export interface NewProduct {
  // _id: string;
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

export interface Product extends NewProduct {
  _id: string; // required once saved
}