import "./Spinner.css";

// A simple loading spinner component.
const Spinner = () => (
  <div className="spinner" role="status">
    <span className="visually-hidden">Loading…</span>
  </div>
);

export default Spinner;
