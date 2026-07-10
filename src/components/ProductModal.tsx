import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProductForm from './ProductForm';

interface ProductModalProps {
  onAddProduct: (product: any) => void;
}

function ProductModal({ onAddProduct }: ProductModalProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="d-flex justify-content-end mb-3">
      {/* Button aligned to the right */}
      <Button variant="primary" onClick={handleShow}>
        Add Product
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            onSubmit={(product) => {
              onAddProduct(product);
              handleClose();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductModal;
