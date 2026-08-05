import ProductCard from "./ProductCard";
import "./ProductGrid.css";

/**
 * Renders products in a grid, or a message if the list is empty. Does not
 * fetch anything itself - the caller decides where the products come from.
 */

// parameter: products - an array of product objects to display in the grid.
// returns: a JSX element representing the product grid or an empty message.
const ProductGrid = ({ products }) => {
  if (products.length === 0) {
    return <p className="product-grid-empty">No products found.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
