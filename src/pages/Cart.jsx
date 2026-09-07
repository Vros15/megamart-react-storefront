import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useCart from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import "./Cart.css";

const Cart = () => {
  const { state, dispatch } = useCart();
  const { items } = state;
  const [searchParams, setSearchParams] = useSearchParams();

  // Captured once, from the URL Stripe redirected back to - not re-read from
  // searchParams after that, since the effect below strips the query param
  // and re-reading it live would make the banner disappear immediately.
  const [checkoutStatus] = useState(() => searchParams.get("checkout"));

  useEffect(() => {
    if (!checkoutStatus) return;

    // The items were "purchased" - the cart resets rather than staying full.
    if (checkoutStatus === "success") {
      dispatch({ type: "CLEAR_CART" });
    }

    // Drops ?checkout=... so refreshing this page doesn't repeat the banner
    // or re-clear an already-empty cart.
    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    setSearchParams(next, { replace: true });
    // Runs once on mount only - checkoutStatus is fixed above, and re-running
    // this whenever searchParams changes would fight its own cleanup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusBanner =
    checkoutStatus === "success" ? (
      <p className="cart-status cart-status-success">Payment successful. Thanks for your order!</p>
    ) : checkoutStatus === "cancelled" ? (
      <p className="cart-status cart-status-cancelled">Checkout was cancelled. Your cart is unchanged.</p>
    ) : null;

  if (items.length === 0) {
    return (
      <>
        <h1>Your Cart</h1>
        {statusBanner}
        <p className="cart-empty">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Your Cart</h1>
      {statusBanner}
      <div className="cart-items">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <CartSummary items={items} />
    </>
  );
};

export default Cart;
