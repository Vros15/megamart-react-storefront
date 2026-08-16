import { useUser } from "@clerk/clerk-react";
import { ADMIN_USER_ID } from "../lib/constants";

/**
 * This only decides what renders, same as everywhere else ADMIN_USER_ID is
 * checked client-side - the API's own 403 is the real boundary.
 */
const useIsAdmin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  return isLoaded && isSignedIn && user.id === ADMIN_USER_ID;
};

export default useIsAdmin;
