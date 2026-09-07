import { useState } from "react";
import { formatPrice } from "../../lib/format";
import { createCheckoutSession } from "../../api/checkout";
import "./CartSummary.css";

// Renders the cart summary, including the total price and a checkout button.
const CartSummary = ({ items }) => {
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState(null);

  // Calculate the total price of all items in the cart.
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // NOTE: TO TEST in a local environment without hitting the backend
  // or Stripe at all (e.g. the backend isn't running locally), swap the real
  // handleCheckout below for this one instead:
  //
  // const handleCheckout = () => {
  //   window.alert(`Total: ${formatPrice(total)}`);
  // };

  // Redirects to a real Stripe Checkout page. Only resets `checkingOut` on
  // failure - a success navigates away, so there's nothing left to reset.
  const handleCheckout = async () => {
    setCheckingOut(true);
    setError(null);

    try {
      const url = await createCheckoutSession(items);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setCheckingOut(false);
    }
  };

  // Render the cart summary UI.
  return (
    <div className="cart-summary">
      <div className="cart-summary-details">
        <p className="cart-summary-total">
          Total: <span className="tabular">{formatPrice(total)}</span>
        </p>
        {error && <p className="cart-summary-error">{error}</p>}
      </div>
      <button type="button" className="cart-summary-checkout" onClick={handleCheckout} disabled={checkingOut}>
        {checkingOut ? "Redirecting…" : "Checkout"}
      </button>
    </div>
  );
};

export default CartSummary;
