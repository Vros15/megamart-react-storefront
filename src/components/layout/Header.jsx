import { NavLink } from "react-router";
import useCart from "../../hooks/useCart";
import logoMark from "../../assets/branding/megamart-mark-primary.svg";
import "./Header.css";

const Header = () => {
  const { state } = useCart();
  // Sum of quantities, not items.length - two units of one product should
  // show 2, not 1.
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <NavLink to="/" className="header-brand">
        <img src={logoMark} alt="" width="28" height="28" className="header-brand-mark" />
        <span className="header-brand-word">
          <span className="header-brand-word-mega">Mega</span>
          <span className="header-brand-word-mart">Mart</span>
        </span>
      </NavLink>

      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink
          to="/cart"
          aria-label={itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart"}
        >
          Cart
          {itemCount > 0 && (
            <span className="header-cart-count" aria-hidden="true">
              {itemCount}
            </span>
          )}
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
