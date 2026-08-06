import { NavLink } from "react-router";
import logoMark from "../../assets/branding/megamart-mark-primary.svg";
import "./Header.css";

const Header = () => (
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
      <NavLink to="/cart">Cart</NavLink>
    </nav>
  </header>
);

export default Header;
