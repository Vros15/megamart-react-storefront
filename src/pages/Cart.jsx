import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import useCart from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import "./Cart.css";

const Cart = () => {
  const { state } = useCart();
  const { items } = state;
  const [searchParams, setSearchParams] = useSearchParams();

  // Captured once, from the URL Stripe redirected back to - not re-read from
  // searchParams after that, since the effect below strips the query param
  // and re-reading it live would make the banner disappear immediately.
  // Success no longer lands here at all - it goes to /checkout/success,
  // which can prove a real payment happened. This page only ever sees a
  // shopper backing out of Stripe.
  const [wasCancelled] = useState(() => searchParams.get("checkout") === "cancelled");

  useEffect(() => {
    if (!wasCancelled) return;

    // Drops ?checkout=cancelled so refreshing this page doesn't repeat it.
    const next = new URLSearchParams(searchParams);
    next.delete("checkout");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusBanner = wasCancelled ? (
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
