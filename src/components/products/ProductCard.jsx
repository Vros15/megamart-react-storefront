import { useState } from "react";
import { formatPrice } from "../../lib/format";
import "./ProductCard.css";

// A card component that displays a single product, including its image, name, category, price, and stock status.
const ProductCard = ({ product }) => {
  // Track whether the product image has failed to load.
  const [imageFailed, setImageFailed] = useState(false);
  // Determine whether to show the product image or the fallback.
  const showImage = product.image && !imageFailed;

  return (
    <article className="product-card">
      <div className="product-card-image-well">
        {/* Show the product image if available and it hasn't failed to load; otherwise, show the fallback. */}
        {showImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card-image"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="product-card-image-fallback" aria-hidden="true" />
        )}
      </div>
      {/* Display the product category, name, and price. */}
      <p className="product-card-category">{product.category}</p>
      <h3 className="product-card-name">{product.name}</h3>
      <p className="product-card-price tabular">{formatPrice(product.price)}</p>
    
      {/* Display the stock status if the product is available & low in stock */}
      {product.stock > 0 && product.stock < 25 && (
        <p className="product-card-low-stock">Only {product.stock} left in stock</p>
      )}

      {/* Display an out-of-stock message if the product is not available. */}
      {product.stock === 0 && <p className="product-card-out-of-stock">Out of stock</p>}
    </article>
  );
};

export default ProductCard;
