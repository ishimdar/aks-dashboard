import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormBootstrap from 'react-bootstrap/Form';
import { useFetch } from '../hooks/useFetch'; // <-- your custom hook
import type { Product } from "../types/Product";
import { API_BASE_URL } from "../config/api";

interface Category {
  id: number;
  name: string;
  shortName: string;
  description: string;
}

interface Unit {
  id: number;
  name: string;
  shortName: string;
  description: string;
}

// interface Product {
//   _id?: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   quantity: number;
//   unit: string;
//   imageFile?: File;
// }

interface ProductFormProps {
  onSubmit: (product: Product) => void;
}

const ProductForm = ({ onSubmit }: ProductFormProps) => {
  // Fetch categories and units
  const { data: categories, isLoading: catLoading, error: catError } = useFetch<Category[]>(
    `${API_BASE_URL}/categories`
  );
  const { data: units, isLoading: unitLoading, error: unitError } = useFetch<Unit[]>(
    `${API_BASE_URL}/units`
  );

  const initialValues: Product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    quantity: 0,
    unit: '',
    imageFile: undefined,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().positive().required('Price is required'),
    stock: Yup.number().min(0).required('Stock is required'),
    quantity: Yup.number().min(0).required('Quantity is required'),
    category: Yup.string().required('Category is required'),
    unit: Yup.string().required('Unit is required'),
    imageFile: Yup.mixed<File>()
      .required('Image is required')
      .test('fileType', 'Only JPEG, JPG, PNG files are allowed', (value?: File) => {
        if (!value) return false;
        return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
      }),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit({ ...values, _id: Date.now().toString() });
        resetForm();
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => (
        <FormBootstrap onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              {/* Name */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Name</FormBootstrap.Label>
                <Field name="name" as={FormBootstrap.Control} type="text" />
                <ErrorMessage name="name" component="div" className="text-danger" />
              </FormBootstrap.Group>

              {/* Price */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Price</FormBootstrap.Label>
                <Field name="price" as={FormBootstrap.Control} type="number" />
                <ErrorMessage name="price" component="div" className="text-danger" />
              </FormBootstrap.Group>

              {/* Stock */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Stock</FormBootstrap.Label>
                <Field name="stock" as={FormBootstrap.Control} type="number" />
                <ErrorMessage name="stock" component="div" className="text-danger" />
              </FormBootstrap.Group>

              {/* Unit dropdown */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Unit</FormBootstrap.Label>
                <Field name="unit" as="select" className="form-select">
                  <option value="">Select unit</option>
                  {unitLoading && <option>Loading...</option>}
                  {unitError && <option>Error loading units</option>}
                  {units?.map((u) => (
                    <option key={u.id} value={u.shortName}>
                      {u.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="unit" component="div" className="text-danger" />
              </FormBootstrap.Group>
            </Col>

            <Col md={6}>
              {/* Description */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Description</FormBootstrap.Label>
                <Field name="description" as={FormBootstrap.Control} type="text" />
              </FormBootstrap.Group>

              {/* Category dropdown */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Category</FormBootstrap.Label>
                <Field name="category" as="select" className="form-select">
                  <option value="">Select category</option>
                  {catLoading && <option>Loading...</option>}
                  {catError && <option>Error loading categories</option>}
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.shortName}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-danger" />
              </FormBootstrap.Group>

              {/* Quantity */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Quantity</FormBootstrap.Label>
                <Field name="quantity" as={FormBootstrap.Control} type="number" />
                <ErrorMessage name="quantity" component="div" className="text-danger" />
              </FormBootstrap.Group>

              {/* Image upload */}
              <FormBootstrap.Group className="mb-3">
                <FormBootstrap.Label>Image</FormBootstrap.Label>
                <FormBootstrap.Control
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    if (event.currentTarget.files) {
                      setFieldValue('imageFile', event.currentTarget.files[0]);
                    }
                  }}
                />
                <ErrorMessage name="imageFile" component="div" className="text-danger" />

                {values.imageFile && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(values.imageFile)}
                      alt="Preview"
                      width="100"
                      height="100"
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </FormBootstrap.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Add Product
            </Button>
          </div>
        </FormBootstrap>
      )}
    </Formik>
  );
};

export default ProductForm;
