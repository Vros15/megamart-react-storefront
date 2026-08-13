import { useUser } from "@clerk/clerk-react";
import { ADMIN_USER_ID } from "../lib/constants";
import Spinner from "../components/ui/Spinner";
import "./Admin.css";

/**
 * Three states, in order: still loading Clerk's auth check, signed out, and
 * signed in but not the admin. Only the fourth case - signed in as the one
 * admin account - reaches product management.
 *
 * The API's 403 (checked against the same ADMIN_USER_ID,server-side) is what actually stops a write.
 */

// Component for the admin page, gating access based on Clerk authentication and the admin user ID.
const Admin = () => {
  
  const { isLoaded, isSignedIn, user } = useUser();

  // If Clerk's auth check is still loading, show a spinner.
  if (!isLoaded) {
    return <Spinner />;
  }

  // If the user is not signed in, prompt them to sign in.
  if (!isSignedIn) {
    return (
      <>
        <h1>Admin</h1>
        <p className="admin-gate-message">Sign in to manage products.</p>
      </>
    );
  }

  // If the signed-in user is not the admin, show an access denied message.
  if (user.id !== ADMIN_USER_ID) {
    return (
      <>
        <h1>Admin</h1>
        <p className="admin-gate-message">This account cannot manage products.</p>
      </>
    );
  }

  // If the signed-in user is the admin, show the product management section.
  return (
    <>
      <h1>Admin</h1>
      <p className="admin-gate-message">Product management coming next.</p>
    </>
  );
};

export default Admin;
