import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';
import { useFetch } from '../hooks/useFetch';
import type { Product } from '../types/Product';
import { API_BASE_URL } from '../config/api';
import Loader from '../components/Loader/Loader';

interface ProductResponse {
  data: Product[];
  msg: string;
}

const Home = () => {
  const { data: productsResponse, isLoading, error, refetch, mutate, mutateLoading } = useFetch<ProductResponse>(
    `${API_BASE_URL}/product`
  );

  const products = productsResponse?.data || [];
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleAddProduct = async (product: Product) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('stock', product.stock.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('unit', product.unit);

    if (product.imageFile) {
      formData.append('image', product.imageFile);
    }

    const result = await mutate(`${API_BASE_URL}/product`, {
      method: 'POST',
      body: formData,
    });

    if (result) {
      refetch();
    }
  };

  const handleEdit = async (product: Product) => {
    try {
      const response = await fetch(`${API_BASE_URL}/product/${product._id}`);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const result = await response.json();
      const productDetails = result?.data || result;
      setEditingProduct(productDetails as Product);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load product for edit:', err);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('category', product.category);
    formData.append('stock', product.stock.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('unit', product.unit);

    if (product.imageFile) {
      formData.append('image', product.imageFile);
    }

    const result = await mutate(`${API_BASE_URL}/product/${product._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (result) {
      refetch();
    }
  };

  const handleDelete = (id: string) => {
    const selectedProduct = products.find((item) => item._id === id) || null;
    setProductToDelete(selectedProduct);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    setShowDeleteModal(false);

    const result = await mutate(`${API_BASE_URL}/product/${productToDelete._id}`, {
      method: 'DELETE',
    });

    if (result !== null || !error) {
      setToastMessage(`"${productToDelete.name}" product deleted successfully.`);
      setShowToast(true);
      refetch();
    } else {
      setToastMessage(`Failed to delete "${productToDelete.name}" product.`);
      setShowToast(true);
    }

    setProductToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="overlay">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleOpenAddModal}>
          Add Product
        </Button>
      </div>

      <ProductTable data={products || []} onEdit={handleEdit} onDelete={handleDelete} />
      <ProductModal
        show={showModal}
        onHide={handleCloseModal}
        editingProduct={editingProduct}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        isSubmitting={mutateLoading}
      />

      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{productToDelete?.name || 'this product'}</strong> product?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={mutateLoading}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1055 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>

      {mutateLoading && (
        <div className="overlay">
          <Loader />
        </div>
      )}
    </>
  );
};

export default Home;
