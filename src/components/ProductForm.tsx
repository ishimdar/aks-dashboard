import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormBootstrap from 'react-bootstrap/Form';
import { useFetch } from '../hooks/useFetch';
import type { NewProduct, Product } from '../types/Product';
import { API_BASE_URL } from '../config/api';

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

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  onCancel?: () => void;
  initialValues?: Partial<Product> | null;
  isEditMode?: boolean;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const ProductForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isEditMode = false,
  submitLabel = 'Add Product',
  isSubmitting = false,
}: ProductFormProps) => {
  const { data: categories, isLoading: catLoading, error: catError } = useFetch<Category[]>(
    `${API_BASE_URL}/categories`
  );
  const { data: units, isLoading: unitLoading, error: unitError } = useFetch<Unit[]>(
    `${API_BASE_URL}/units`
  );

  const defaultInitialValues: NewProduct = {
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    quantity: 0,
    unit: '',
    imageFile: undefined,
    imageUrl: undefined,
  };

  const formInitialValues: NewProduct = {
    ...defaultInitialValues,
    ...initialValues,
    imageFile: undefined,
    imageUrl: initialValues?.imageUrl ?? undefined,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    price: Yup.number().positive().required('Price is required'),
    stock: Yup.number().min(0).required('Stock is required'),
    quantity: Yup.number().min(0).required('Quantity is required'),
    category: Yup.string().required('Category is required'),
    unit: Yup.string().required('Unit is required'),
    imageFile: isEditMode
      ? Yup.mixed<File>().test('fileType', 'Only JPEG, JPG, PNG files are allowed', (value?: File) => {
          if (!value) return true;
          return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
        })
      : Yup.mixed<File>()
          .required('Image is required')
          .test('fileType', 'Only JPEG, JPG, PNG files are allowed', (value?: File) => {
            if (!value) return false;
            return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
          }),
  });

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        const payload = {
          ...values,
          _id: initialValues?._id ?? Date.now().toString(),
        } as Product;
        onSubmit(payload);
        if (!isEditMode) {
          resetForm();
        }
      }}
    >
      {({ handleSubmit, setFieldValue, values }) => {
        const previewImage = values.imageFile
          ? URL.createObjectURL(values.imageFile)
          : values.imageUrl;

        return (
          <FormBootstrap onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FormBootstrap.Group className="mb-3">
                  <FormBootstrap.Label>Name</FormBootstrap.Label>
                  <Field name="name" as={FormBootstrap.Control} type="text" />
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </FormBootstrap.Group>

                <FormBootstrap.Group className="mb-3">
                  <FormBootstrap.Label>Price</FormBootstrap.Label>
                  <Field name="price" as={FormBootstrap.Control} type="number" />
                  <ErrorMessage name="price" component="div" className="text-danger" />
                </FormBootstrap.Group>

                <FormBootstrap.Group className="mb-3">
                  <FormBootstrap.Label>Stock</FormBootstrap.Label>
                  <Field name="stock" as={FormBootstrap.Control} type="number" />
                  <ErrorMessage name="stock" component="div" className="text-danger" />
                </FormBootstrap.Group>

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
                <FormBootstrap.Group className="mb-3">
                  <FormBootstrap.Label>Description</FormBootstrap.Label>
                  <Field name="description" as={FormBootstrap.Control} type="text" />
                </FormBootstrap.Group>

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

                <FormBootstrap.Group className="mb-3">
                  <FormBootstrap.Label>Quantity</FormBootstrap.Label>
                  <Field name="quantity" as={FormBootstrap.Control} type="number" />
                  <ErrorMessage name="quantity" component="div" className="text-danger" />
                </FormBootstrap.Group>

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

                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
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

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" type="button" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </div>
          </FormBootstrap>
        );
      }}
    </Formik>
  );
};

export default ProductForm;
