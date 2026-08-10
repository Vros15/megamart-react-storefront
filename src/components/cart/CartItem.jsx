import { formatPrice } from "../../lib/format";
import ImageWithFallback from "../ui/ImageWithFallback";
import "./CartItem.css";

// Renders a single item in the cart, displaying its image, name, unit price, quantity, and line total.
const CartItem = ({ item }) => (
  <div className="cart-item">
    <div className="cart-item-image-well">
      <ImageWithFallback
        src={item.image}
        alt={item.name}
        imageClassName="cart-item-image"
        fallbackClassName="cart-item-image-fallback"
      />
    </div>

    {/* Cart item details: name and unit price */}
    <div className="cart-item-details">
      <p className="cart-item-name">{item.name}</p>
      <p className="cart-item-unit-price tabular">{formatPrice(item.price)} each</p>
    </div>

    {/* Cart item quantity */}
    <p className="cart-item-quantity">Qty: {item.quantity}</p>

    <p className="cart-item-line-total tabular">{formatPrice(item.price * item.quantity)}</p>
  </div>
);

export default CartItem;
