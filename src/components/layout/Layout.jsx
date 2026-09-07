import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Wraps every page. Header and Footer render once and stay mounted across
 * navigation; only the <Outlet /> contents change when the route changes.
 */
const Layout = () => (
  <>
    <Header />
    <main className="container">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default Layout;
