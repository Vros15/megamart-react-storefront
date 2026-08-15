import "./Toast.css";

/**
 * Renders nothing while no toast is active. Keyed by `toast.id` so a second
 * toast firing before the first finishes remounts the element - restarting
 * the CSS animation instead of it jumping mid-fade.
 */
const Toast = ({ toast }) => {
  if (!toast) return null;

  return (
    <div key={toast.id} className="toast" role="status">
      {toast.message}
    </div>
  );
};

export default Toast;
