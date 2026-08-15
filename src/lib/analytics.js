const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

/**
 * Loads gtag.js and configures it with page_view sending turned off -
 * trackPageview sends that event manually instead, since a single-page app
 * only fires one real page load and gtag's default reporting would never
 * see a route change.
 */
const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID || initialized) return;
  initialized = true;

  // Load the gtag.js script asynchronously
  const script = document.createElement("script");
  // Set the source URL for the gtag.js script
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize the dataLayer and gtag function for tracking events
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
};

/**
 * Records one page view. Call on every route change - `path` should include
 * the search string, since `?category=Audio` is a meaningfully different
 * view of the same route.
 */
const trackPageview = (path) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", { page_path: path });
};

export { initAnalytics, trackPageview };
