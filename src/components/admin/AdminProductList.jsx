import { formatPrice } from "../../lib/format";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./AdminProductList.css";

// TODO: Add functionality for creating, editing, and deleting products in the future.

// Currently, this component is read-only and only displays the list of products.
const AdminProductList = ({ products }) => {
  // If there are no products, display a message indicating that the list is empty.
  if (products.length === 0) {
    return <p className="admin-product-list-empty">No products yet.</p>;
  }

  // Otherwise, render the list of products.
  return (
    <div className="admin-product-list">
      {/* Map over the products array and render each product as a row. */}
      {products.map((product) => (
        <div key={product.id} className="admin-product-row">
          <div className="admin-product-row-image-well">
            <ImageWithFallback
              src={product.image}
              alt=""
              imageClassName="admin-product-row-image"
              fallbackClassName="admin-product-row-image-fallback"
            />
          </div>
          {/* Render the product details such as name and category. */}
          <div className="admin-product-row-details">
            <p className="admin-product-row-name">{product.name}</p>
            <p className="admin-product-row-category">{product.category}</p>
          </div>

          {/* Render the product price and stock information. */}
          <p className="admin-product-row-price tabular">{formatPrice(product.price)}</p>
          <p className="admin-product-row-stock">{product.stock} in stock</p>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
