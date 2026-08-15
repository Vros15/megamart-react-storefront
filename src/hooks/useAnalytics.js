import { useEffect } from "react";
import { useLocation } from "react-router";
import { trackPageview } from "../lib/analytics";

// Sends a page_view on every route change. Must be called from a component
// rendered inside BrowserRouter, since useLocation needs the router context.
const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageview(location.pathname + location.search);
  }, [location]);
};

export default useAnalytics;
