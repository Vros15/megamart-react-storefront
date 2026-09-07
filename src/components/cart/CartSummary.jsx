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

  // Redirects to a real Stripe Checkout page (test mode). Only resets
  // `checkingOut` on failure - a success navigates away, so there's nothing
  // left to reset. Any of these simulate a different outcome, full list at
  // https://docs.stripe.com/testing - expiry/CVC/ZIP can be anything:
  //
  //   4242 4242 4242 4242   Successful payment
  //   4000 0000 0000 0002   Card declined (generic)
  //   4000 0000 0000 9995   Declined for insufficient funds
  //   4000 0025 0000 3155   Requires 3D Secure authentication
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
    <div className="cart-summary-wrap">
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

      {/* This is a demo store - real visitors land on a real Stripe page
          with no way to know what to type without this. */}
      <table className="cart-summary-test-cards">
        <caption>Test mode: Any of these cards, any future date, any 3-digit CVC, any name / email / zip</caption>
        <thead>
          <tr>
            <th scope="col">Card number</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tabular">4242 4242 4242 4242</td>
            <td>Successful payment</td>
          </tr>
          <tr>
            <td className="tabular">4000 0000 0000 0002</td>
            <td>Card declined</td>
          </tr>
          <tr>
            <td className="tabular">4000 0000 0000 9995</td>
            <td>Insufficient funds</td>
          </tr>
          <tr>
            <td className="tabular">4000 0025 0000 3155</td>
            <td>Requires 3D Secure</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CartSummary;
