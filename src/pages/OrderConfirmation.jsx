import { useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { fetchCheckoutSession } from "../api/checkout";
import useCart from "../hooks/useCart";
import useFetch from "../hooks/useFetch";
import { formatPrice } from "../lib/format";
import Spinner from "../components/ui/Spinner";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { dispatch } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // useCallback so the reference only changes when sessionId does -
  // useFetch's effect depends on this reference.
  const fetchSession = useCallback(() => fetchCheckoutSession(sessionId), [sessionId]);
  const { data, loading, error } = useFetch(fetchSession);

  // The items were purchased - the cart resets rather than staying full.
  // Runs once the real session confirms payment, not just on arrival here,
  // since arriving at this URL alone isn't proof anything was actually paid.
  useEffect(() => {
    if (data?.paid) {
      dispatch({ type: "CLEAR_CART" });
    }
  }, [data, dispatch]);

  if (!sessionId) {
    return (
      <div className="order-confirmation-message">
        <p>No order to show.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  if (error || !data?.paid) {
    return (
      <div className="order-confirmation-message">
        <p>{error || "This order could not be confirmed."}</p>
        <Link to="/cart">Back to cart</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="order-confirmation-banner">
        <h1>Payment successful</h1>
        <p>Thanks for your order! Here&apos;s what you got.</p>
      </div>

      <ul className="order-confirmation-items">
        {data.items.map((item) => (
          <li key={item.name} className="order-confirmation-item">
            <span className="order-confirmation-item-name">
              {item.name} <span className="order-confirmation-item-qty">x{item.quantity}</span>
            </span>
            <span className="order-confirmation-item-amount tabular">{formatPrice(item.amount)}</span>
          </li>
        ))}
      </ul>

      <p className="order-confirmation-total">
        Total: <span className="tabular">{formatPrice(data.total)}</span>
      </p>

      <Link to="/" className="order-confirmation-continue">
        Continue shopping
      </Link>
    </div>
  );
};

export default OrderConfirmation;
