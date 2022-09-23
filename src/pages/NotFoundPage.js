import "../styles/NotFoundPage.scss";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div id="not-found-page">
      <p className="not-found-text">It looks like this page doesn't exist</p>
      <Link to={"/"}>
        <p>Take me home</p>
      </Link>
    </div>
  );
};

export default NotFound;
