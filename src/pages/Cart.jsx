import { Link } from "react-router";
import useCart from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import "./Cart.css";

const Cart = () => {
  const { state } = useCart();
  const { items } = state;

  if (items.length === 0) {
    return (
      <>
        <h1>Your Cart</h1>
        <p className="cart-empty">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Your Cart</h1>
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
