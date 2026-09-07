import { useCallback } from "react";
import { Link, useParams } from "react-router";
import { fetchProductById } from "../api/products";
import useFetch from "../hooks/useFetch";
import { formatPrice } from "../lib/format";
import AddToCartButton from "../components/products/AddToCartButton";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Spinner from "../components/ui/Spinner";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();

  // useCallback so the reference only changes when `id` does - useFetch's
  // effect depends on this reference, and a new function every render would
  // refetch every render.
  const fetchThisProduct = useCallback(() => fetchProductById(id), [id]);
  const { data: product, loading, error } = useFetch(fetchThisProduct);

  if (loading) {
    return <Spinner />;
  }

  // Covers both a bad/deleted id (the API's 404) and a real network failure -
  // fetchProductById only surfaces a message string either way, so there's
  // no reliable way to tell them apart here without more from the API.
  if (error) {
    return (
      <div className="product-detail-message">
        <p>{error}</p>
        <Link to="/">Back to shopping</Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <article className="product-detail">
      <div className="product-detail-image-well">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          imageClassName="product-detail-image"
          fallbackClassName="product-detail-image-fallback"
        />
      </div>

      <div className="product-detail-info">
        <p className="product-detail-category">{product.category}</p>
        <h1 className="product-detail-name">{product.name}</h1>
        <p className="product-detail-price tabular">{formatPrice(product.price)}</p>

        {product.description && <p className="product-detail-description">{product.description}</p>}

        {product.stock > 0 && product.stock < 25 && (
          <p className="product-detail-low-stock">Only {product.stock} left in stock</p>
        )}
        {product.stock === 0 && <p className="product-detail-out-of-stock">Out of stock</p>}

        <AddToCartButton product={product} />
      </div>
    </article>
  );
};

export default ProductDetail;
