import { formatPrice } from "../../lib/format";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./AdminProductList.css";

// AdminProductList displays a list of products for management purposes, allowing editing and deletion.
const AdminProductList = ({ products, onEdit, onDelete, deletingId }) => {
  if (products.length === 0) {
    return <p className="admin-product-list-empty">No products yet.</p>;
  }

  return (
    <div className="admin-product-list">
      {products.map((product) => {
        // Determine if the current product is being deleted
        const isDeleting = deletingId === product.id;

        return (
          <div key={product.id} className="admin-product-row">
            <div className="admin-product-row-image-well">
              <ImageWithFallback
                src={product.image}
                alt=""
                imageClassName="admin-product-row-image"
                fallbackClassName="admin-product-row-image-fallback"
              />
            </div>

            <div className="admin-product-row-details">
              <p className="admin-product-row-name">{product.name}</p>
              <p className="admin-product-row-category">{product.category}</p>
            </div>

            <p className="admin-product-row-price tabular">{formatPrice(product.price)}</p>
            <p className="admin-product-row-stock">{product.stock} in stock</p>
            {/* Action buttons for editing and deleting the product */}
            <button
              type="button"
              className="admin-product-row-edit"
              onClick={() => onEdit(product)}
              disabled={isDeleting}
            >
              Edit
            </button>
            {/* Delete button for the product */}
            <button
              type="button"
              className="admin-product-row-delete"
              // Confirm deletion before proceeding
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this product?")) {
                  onDelete(product);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AdminProductList;
