import { createContext, useCallback, useRef, useState } from "react";
import Toast from "../components/ui/Toast";

const ToastContext = createContext(null);

/**
 * One toast at a time, not a queue - a shopper clicking "Add to Cart"
 * repeatedly should see the message reset and restart, not stack up.
 * `id` changes on every call so Toast remounts and its CSS animation
 * restarts even if the message text is identical to the last one.
 */
const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timeoutRef.current);
    setToast({ message, id: Date.now() });
    timeoutRef.current = setTimeout(() => setToast(null), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toast={toast} />
    </ToastContext.Provider>
  );
};

export { ToastContext, ToastProvider };
