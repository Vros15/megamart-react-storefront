import { Link, NavLink, useLocation } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import useCart from "../../hooks/useCart";
import logoMark from "../../assets/branding/megamart-mark-primary.svg";
import SearchBar from "./SearchBar";
import Icon from "../ui/Icon";
import homeIcon from "../../assets/nav-icons/home.svg?raw";
import ordersIcon from "../../assets/nav-icons/orders.svg?raw";
import cartIcon from "../../assets/nav-icons/cart.svg?raw";
import signInIcon from "../../assets/nav-icons/sign-in.svg?raw";
import "./Header.css";

const Header = () => {
  const { state } = useCart();
  const { pathname } = useLocation();
  // Sum of quantities, not items.length - two units of one product should
  // show 2, not 1.
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartLabel = itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}` : "Cart";
  const isHome = pathname === "/";

  return (
    <>
      <header className="header">
        <NavLink to="/" className="header-brand">
          <img src={logoMark} alt="" width="28" height="28" className="header-brand-mark" />
          <span className="header-brand-word">
            <span className="header-brand-word-mega">Mega</span>
            <span className="header-brand-word-mart">Mart</span>
          </span>
        </NavLink>

        {/* Search bar slot, only shown on the home page */}
        {isHome && (
          <div className="header-search-slot">
            <SearchBar />
          </div>
        )}

        {/* Orders/sign-in/Cart. Hidden below the breakpoint in favor of the
            fixed mobile-tab-bar underneath, which carries the same three. */}
        <nav className="header-account-nav">
          <Link to="/orders" className="header-account-link">
            Orders
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button type="button" className="header-account-link">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <NavLink to="/cart" className="header-account-link" aria-label={cartLabel}>
            Cart
            {itemCount > 0 && (
              <span className="header-cart-count" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </NavLink>
        </nav>
      </header>

      {/* Mobile tab bar, only shown below the breakpoint defined in Header.css */}
      <nav className="mobile-tab-bar" aria-label="Primary">
        <NavLink to="/" end className="mobile-tab-bar-item">
          <Icon svg={homeIcon} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/orders" className="mobile-tab-bar-item">
          <Icon svg={ordersIcon} />
          <span>Orders</span>
        </NavLink>

        <SignedOut>
          <SignInButton mode="modal">
            <button type="button" className="mobile-tab-bar-item">
              <Icon svg={signInIcon} />
              <span>Sign in</span>
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="mobile-tab-bar-item mobile-tab-bar-item--account">
            <UserButton />
            <span>Account</span>
          </div>
        </SignedIn>

        <NavLink to="/cart" className="mobile-tab-bar-item" aria-label={cartLabel}>
          <span className="mobile-tab-bar-icon-wrap">
            <Icon svg={cartIcon} />
            {itemCount > 0 && (
              <span className="header-cart-count mobile-tab-bar-badge" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </span>
          <span>Cart</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Header;
