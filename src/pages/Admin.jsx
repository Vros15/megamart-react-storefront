import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import useAdminApi from "../hooks/useAdminApi";
import { ADMIN_USER_ID } from "../lib/constants";
import AdminDashboard from "../components/admin/AdminDashboard";
import Spinner from "../components/ui/Spinner";
import "./Admin.css";

/**
 * Three states, in order: still loading Clerk's auth check, signed out, and
 * signed in but not the admin. Only the fourth case - signed in as the one
 * admin account - reaches product management, delegated entirely to
 * AdminDashboard.
 *
 * The API's 403 (checked against the same ADMIN_USER_ID, server-side) is
 * what actually stops a write - this gate only decides what renders.
 *
 * useAdminApi runs unconditionally, before any of the gate's early returns -
 * React requires every hook to run on every render.
 */
const Admin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { write } = useAdminApi();

  if (!isLoaded) {
    return <Spinner />;
  }

  if (!isSignedIn) {
    return (
      <>
        <h1 className="admin-gate-message">Are you signed in?</h1>
        <p className="admin-gate-message"> <Link to="/">Go Back Home</Link></p>
      </>
    );
  }

  if (user.id !== ADMIN_USER_ID) {
    return (
      <>
        <h1 className="admin-gate-message">Sorry!</h1>
        <p className="admin-gate-message">This account cannot manage products.</p>
      </>
    );
  }

  return (
    <>
      <h1 className="admin-gate-message">Admin Panel</h1>
      <AdminDashboard write={write} />
    </>
  );
};

export default Admin;
