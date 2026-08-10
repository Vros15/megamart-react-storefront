import { formatPrice } from "../../lib/format";
import "./CartSummary.css";

// Renders the cart summary, including the total price and a checkout button.
const CartSummary = ({ items }) => {

  // Calculate the total price of all items in the cart.
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle the checkout button click by displaying the total price.
  const handleCheckout = () => {
    window.alert(`Total: ${formatPrice(total)}`);
  };

  // Render the cart summary UI.
  return (
    <div className="cart-summary">
      <p className="cart-summary-total">
        Total: <span className="tabular">{formatPrice(total)}</span>
      </p>
      <button type="button" className="cart-summary-checkout" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartSummary;
