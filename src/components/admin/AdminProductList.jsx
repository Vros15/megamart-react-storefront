import { formatPrice } from "../../lib/format";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./AdminProductList.css";

/**
 * Delete lands in a later task. Reuses the same image-with-fallback and
 * price formatting as the storefront, since this is the same product data,
 * just a denser view meant for management rather than shopping.
 */
const AdminProductList = ({ products, onEdit }) => {
  if (products.length === 0) {
    return <p className="admin-product-list-empty">No products yet.</p>;
  }

  return (
    <div className="admin-product-list">
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

          <div className="admin-product-row-details">
            <p className="admin-product-row-name">{product.name}</p>
            <p className="admin-product-row-category">{product.category}</p>
          </div>

          <p className="admin-product-row-price tabular">{formatPrice(product.price)}</p>
          <p className="admin-product-row-stock">{product.stock} in stock</p>

          <button type="button" className="admin-product-row-edit" onClick={() => onEdit(product)}>
            Edit
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminProductList;
