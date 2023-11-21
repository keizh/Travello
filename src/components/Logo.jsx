import styles from "./Logo.module.css";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className={styles.Link}>
      <img src="/logo-2.png" alt="WorldWise logo" className={styles.logo} />
      <span className={styles.Organisation}>Travello</span>
    </Link>
  );
}

export default Logo;
