import Modal from 'react-bootstrap/Modal';
import ProductForm from './ProductForm';
import type { Product } from '../types/Product';

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  editingProduct: Product | null;
  onAddProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (product: Product) => Promise<void>;
  isSubmitting?: boolean;
}

function ProductModal({
  show,
  onHide,
  editingProduct,
  onAddProduct,
  onUpdateProduct,
  isSubmitting = false,
}: ProductModalProps) {
  const isEditMode = Boolean(editingProduct);

  const handleSubmit = async (product: Product) => {
    if (isEditMode) {
      await onUpdateProduct(product);
    } else {
      await onAddProduct(product);
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{isEditMode ? 'Edit Product' : 'Add Product'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProductForm
          initialValues={editingProduct}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          submitLabel={isEditMode ? 'Update Product' : 'Add Product'}
          onSubmit={handleSubmit}
          onCancel={onHide}
        />
      </Modal.Body>
    </Modal>
  );
}

export default ProductModal;
