import useCart from "../../hooks/useCart";
import "./AddToCartButton.css";

/**
 * Adds a product to the cart. Disables itself when the product is out of
 * stock, using the same product.stock the card already displays "Out of
 * stock" from - otherwise a shopper could add something the card is telling
 * them isn't available.
 */
const AddToCartButton = ({ product }) => {
  const { dispatch } = useCart();
  const outOfStock = product.stock === 0;

  const handleClick = () => {
    dispatch({ type: "ADD_ITEM", payload: product });
  };

  return (
    <button
      type="button"
      className="add-to-cart-button"
      onClick={handleClick}
      disabled={outOfStock}
    >
      {outOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
