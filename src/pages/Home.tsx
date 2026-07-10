import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import { useFetch } from "../hooks/useFetch"; // <-- import custom hook
import type { Product } from "../types/Product";
import { API_BASE_URL } from "../config/api";

interface ProductResponse {
  data: Product[];
  msg: string;
}

const Home = () => {
  // Fetch products from API
  const { data: productsResponse, isLoading, error, refetch, mutate } = useFetch<ProductResponse>(
    `${API_BASE_URL}/product`
    // "https://aks-admin.onrender.com/api/v1/product"
  );

  const products = productsResponse?.data || [];
  

  // const handleAddProduct = async (product: Product) => {
  //   const result = await mutate("http://localhost:5000/api/v1/product", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(product),
  //     });

  //   if (result) {
  //     console.log("Product added:", result);
  //     refetch(); // reload products
  //   }
  // };
  const handleAddProduct = async (product: Product) => {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", product.price.toString());
  formData.append("category", product.category);
  formData.append("stock", product.stock.toString());
  formData.append("quantity", product.quantity.toString());
  formData.append("unit", product.unit);

  if (product.imageFile) {
    formData.append("image", product.imageFile); // actual file
  }

  const result = await mutate(`${API_BASE_URL}/product`, {
    method: "POST",
    body: formData,
    // ⚠️ Do NOT set Content-Type manually — browser will set multipart/form-data with boundary
  });

  if (result) {
    console.log("Product added:", result);
    refetch(); // reload product list
  }
};

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product);
    // open modal or call PUT API
  };

  const handleDelete = (id: string) => {
    console.log("Delete product with id:", id);
    // call DELETE API, then refetch
    refetch();
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <>
      <ProductTable 
        data={products || []}
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      <ProductModal onAddProduct={handleAddProduct} />
    </>
  );
};

export default Home;
