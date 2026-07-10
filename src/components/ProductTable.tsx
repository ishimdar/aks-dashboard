import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaTrash } from 'react-icons/fa'; // import icons
import type { Product } from "../types/Product";

// Define the shape of your product data
// interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   quantity: number;
//   unit: string;
//   imageUrl: string;
// }

// Type the props for your component
interface ProductTableProps {
  data: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ data, onEdit, onDelete }:ProductTableProps) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Quantity</th>
          <th>Unit</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item._id}>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>₹{item.price}</td>
            <td>{item.category}</td>
            <td>{item.stock}</td>
            <td>{item.quantity}</td>
            <td>{item.unit}</td>
            <td>
              <img
                src={item.imageUrl}
                alt={item.name}
                width="60"
                height="60"
                style={{ objectFit: 'cover', borderRadius: '4px' }}
              />
            </td>
            <td>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => onEdit(item)}
              >
                <FaEdit /> {/* Edit icon */}
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(item._id)}
              >
                <FaTrash /> {/* Delete icon */}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ProductTable;
