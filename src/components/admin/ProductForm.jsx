import { useState } from "react";
import CATEGORIES from "../../lib/categories";
import "./ProductForm.css";

/**
 * One form for both create and edit. Purely presentational - validates and
 * calls onSubmit with a payload; it never calls the API itself. The caller
 * decides what onSubmit does (POST vs PUT, which endpoint).
 *
 * On edit, the payload contains only fields that actually changed from
 * initialValues - the API's PUT is a genuine partial update, and sending the
 * whole product back on every edit would ignore that for no reason. If
 * nothing changed, onSubmit is never called - there is nothing to save, and
 * no reason to make a request for it.
 */
const ProductForm = ({ initialValues, onSubmit, submitLabel = "Save" }) => {
  const isEditing = !!initialValues;

  // Form state and validation errors
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    price: initialValues?.price != null ? String(initialValues.price) : "",
    category: initialValues?.category ?? "",
    stock: initialValues?.stock != null ? String(initialValues.stock) : "",
    image: initialValues?.image ?? "",
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // Every populated field must be individually valid regardless of mode -
  // partial update only changes what gets sent, not what a filled-in field
  // is allowed to contain.
  const validate = () => {
    const nextErrors = {};

    // Name and description are required
    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.description.trim()) nextErrors.description = "Description is required.";
    // Price is required and must be a non-negative number
    const price = Number(values.price);
    if (values.price.trim() === "" || Number.isNaN(price) || price < 0) {
      nextErrors.price = "Price must be a number 0 or greater.";
    }

    // Category is required
    if (!values.category) nextErrors.category = "Category is required.";

    // Stock is required and must be a non-negative integer
    const stock = Number(values.stock);
    if (values.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = "Stock must be a whole number 0 or greater.";
    }

    // Image is optional, no validation needed
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Builds the payload for creating a new product, including all fields
  const buildCreatePayload = () => ({
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    category: values.category,
    stock: Number(values.stock),
    // Optional - omitted entirely rather than sent as "", so a create with no
    // image doesn't clear a field that was never set.
    ...(values.image.trim() ? { image: values.image.trim() } : {}),
  });

  // Compares against the original values and keeps only what changed, with
  // the same type conversion buildCreatePayload applies (price/stock are
  // form strings until here). This is used for editing an existing product.
  const buildEditPayload = () => {
    const payload = {};

    // Only include fields that have changed from the initial values
    if (values.name.trim() !== initialValues.name) payload.name = values.name.trim();
    if (values.description.trim() !== initialValues.description) {
      payload.description = values.description.trim();
    }
    // Price is required and must be a non-negative number
    if (Number(values.price) !== initialValues.price) payload.price = Number(values.price);
    if (values.category !== initialValues.category) payload.category = values.category;
    if (Number(values.stock) !== initialValues.stock) payload.stock = Number(values.stock);
    if (values.image.trim() !== (initialValues.image ?? "")) payload.image = values.image.trim();

    return payload;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    if (isEditing) {
      const payload = buildEditPayload();
      // If editing, only submit the fields that have changed
      if (Object.keys(payload).length === 0) return; 
      onSubmit(payload);
      return;
    }

    onSubmit(buildCreatePayload());
  };

  return (
    // Product form for creating or editing a product
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="product-form-field">
        <label htmlFor="product-form-name">Name</label>
        <input
          id="product-form-name"
          type="text"
          value={values.name}
          onChange={handleChange("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "product-form-name-error" : undefined}
        />
        {errors.name && (
          <p id="product-form-name-error" className="product-form-error">
            {errors.name}
          </p>
        )}
      </div>
      {/* Product description field */}
      <div className="product-form-field">
        <label htmlFor="product-form-description">Description</label>
        <textarea
          id="product-form-description"
          value={values.description}
          onChange={handleChange("description")}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "product-form-description-error" : undefined}
        />
        {errors.description && (
          <p id="product-form-description-error" className="product-form-error">
            {errors.description}
          </p>
        )}
      </div>

      {/* Product price and stock fields */}
      <div className="product-form-row">
        <div className="product-form-field">
          <label htmlFor="product-form-price">Price</label>
          <input
            id="product-form-price"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={values.price}
            onChange={handleChange("price")}
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "product-form-price-error" : undefined}
          />
          {errors.price && (
            <p id="product-form-price-error" className="product-form-error">
              {errors.price}
            </p>
          )}
        </div>

        <div className="product-form-field">
          <label htmlFor="product-form-stock">Stock</label>
          <input
            id="product-form-stock"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.stock}
            onChange={handleChange("stock")}
            aria-invalid={!!errors.stock}
            aria-describedby={errors.stock ? "product-form-stock-error" : undefined}
          />
          {errors.stock && (
            <p id="product-form-stock-error" className="product-form-error">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      {/* Product category field */}
      <div className="product-form-field">
        <label htmlFor="product-form-category">Category</label>
        <select
          id="product-form-category"
          value={values.category}
          onChange={handleChange("category")}
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "product-form-category-error" : undefined}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="product-form-category-error" className="product-form-error">
            {errors.category}
          </p>
        )}
      </div>

      {/* Product image field */}
      <div className="product-form-field">
        <label htmlFor="product-form-image">Image URL</label>
        <input
          id="product-form-image"
          type="url"
          value={values.image}
          onChange={handleChange("image")}
          placeholder="https://..."
        />
        <p className="product-form-hint">
          A link to an image, not a file - there is no upload.
        </p>
      </div>

      <button type="submit" className="product-form-submit">
        {submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;
