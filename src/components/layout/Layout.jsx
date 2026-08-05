import { Outlet } from "react-router";
import Header from "./Header";

/**
 * Wraps every page. Header renders once and stays mounted across navigation;
 * only the <Outlet /> contents change when the route changes.
 */
const Layout = () => (
  <>
    <Header />
    <main className="container">
      <Outlet />
    </main>
  </>
);

export default Layout;
