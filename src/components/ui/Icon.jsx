// Renders an inline SVG icon, inheriting text color via `currentColor`.
const Icon = ({ svg, className }) => (
  <span
    className={`icon${className ? ` ${className}` : ""}`}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

export default Icon;
