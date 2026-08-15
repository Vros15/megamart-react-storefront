import { useEffect, useRef, useState } from "react";
import useCart from "../../hooks/useCart";
import useToast from "../../hooks/useToast";
import "./AddToCartButton.css";

/**
 * Adds a product to the cart. Disables itself when the product is out of
 * stock, using the same product.stock the card already displays "Out of
 * stock" from - otherwise a shopper could add something the card is telling
 * them isn't available.
 *
 * `justAdded` briefly swaps the label for a drawn checkmark. It never
 * disables the button while true - clicking three times fast should add
 * three, and the timer below just restarts on every click rather than
 * blocking the next one.
 */
const AddToCartButton = ({ product }) => {
  const { dispatch } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef(null);
  const outOfStock = product.stock === 0;

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const handleClick = () => {
    dispatch({ type: "ADD_ITEM", payload: product });
    showToast(`Added "${product.name}" to cart`);

    clearTimeout(timeoutRef.current);
    setJustAdded(true);
    timeoutRef.current = setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <button
      type="button"
      className={`add-to-cart-button${justAdded ? " add-to-cart-button--added" : ""}`}
      onClick={handleClick}
      disabled={outOfStock}
    >
      {outOfStock ? (
        "Out of Stock"
      ) : justAdded ? (
        <>
          <svg
            className="add-to-cart-check"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="4 12 9 17 20 6" />
          </svg>
          Added
        </>
      ) : (
        "Add to Cart"
      )}
    </button>
  );
};

export default AddToCartButton;
