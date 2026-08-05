import { NavLink } from "react-router";


const Header = () => (
  <header>
    <NavLink to="/">MegaMart</NavLink>

    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/cart">Cart</NavLink>
    </nav>
  </header>
);

export default Header;
