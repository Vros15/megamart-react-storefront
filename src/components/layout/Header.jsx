import { Link, NavLink } from "react-router";
import useCart from "../../hooks/useCart";
import logoMark from "../../assets/branding/megamart-mark-primary.svg";
import SearchBar from "./SearchBar";
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

      <SearchBar />

      <nav className="header-account-nav">
        {/*
          ToDO: Implement authentication and order history pages.
        */}
        <Link to="/sign-in" className="header-account-link">
          Sign in
        </Link>
        <Link to="/orders" className="header-account-link">
          Orders
        </Link>
        <NavLink
          to="/cart"
          className="header-account-link"
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
