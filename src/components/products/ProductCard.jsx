import { formatPrice } from "../../lib/format";
import AddToCartButton from "./AddToCartButton";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./ProductCard.css";

// A card component that displays a single product, including its image, name, category, price, and stock status.
const ProductCard = ({ product }) => (
  <article className="product-card">
    <div className="product-card-image-well">
      <ImageWithFallback
        src={product.image}
        alt={product.name}
        imageClassName="product-card-image"
        fallbackClassName="product-card-image-fallback"
      />
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

    <AddToCartButton product={product} />
  </article>
);

export default ProductCard;
