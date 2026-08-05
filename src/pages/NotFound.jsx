import { Link } from "react-router";

const NotFound = () => (
  <>
    <h1>Sorry! page not found!</h1>
    <p>
      <Link to="/">Return home</Link>
    </p>
  </>
);

export default NotFound;
