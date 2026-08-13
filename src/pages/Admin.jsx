import { useUser } from "@clerk/clerk-react";
import { fetchProducts } from "../api/products";
import useFetch from "../hooks/useFetch";
import { ADMIN_USER_ID } from "../lib/constants";
import AdminProductList from "../components/admin/AdminProductList";
import Spinner from "../components/ui/Spinner";
import "./Admin.css";

/**
 * Three states, in order: still loading Clerk's auth check, signed out, and
 * signed in but not the admin. Only the fourth case - signed in as the one
 * admin account - reaches product management.
 *
 * The API's 403 (checked against the same ADMIN_USER_ID, server-side) is
 * what actually stops a write.
 *
 * useFetch runs unconditionally, before any of the gate's early returns -
 * React requires every hook to run on every render, so it can't sit inside
 * the admin-only branch below. The fetch itself is harmless either way; GET
 * is public and this is the same request Home already makes for everyone.
 */
const Admin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  // Fetch the list of products using the custom useFetch hook. This runs regardless of the user's admin status.
  const { data, loading, error } = useFetch(fetchProducts);

  if (!isLoaded) {
    return <Spinner />;
  }
  // If the user is not signed in, show a message prompting them to sign in.
  if (!isSignedIn) {
    return (
      <>
        <h1>Admin</h1>
        <p className="admin-gate-message">Sign in to manage products.</p>
      </>
    );
  }

  // If the user is signed in but is not the admin, show a message indicating they cannot manage products.
  if (user.id !== ADMIN_USER_ID) {
    return (
      <>
        <h1>Admin</h1>
        <p className="admin-gate-message">This account cannot manage products.</p>
      </>
    );
  }
  // If the user is signed in as the admin, render the product management interface.
  return (
    <>
      <h1>Admin</h1>

      {loading && <Spinner />}

      {error && <p className="admin-gate-message">Could not load products: {error}</p>}
      {/* Render the list of products if available from the API. */}
      {data && <AdminProductList products={data.products} />}
    </>
  );
};

export default Admin;
