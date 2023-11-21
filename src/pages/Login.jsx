import styles from "./Login.module.css";
import { useState } from "react";
// import { useAuthentication } from "./context/FakeAuthenticationContext";
import PageNav from "../components/PageNav";
import Button from "../components/Button";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("krishna@example.com");
  const [password, setPassword] = useState("qwertyuiop");
  // const { login } = useAuthentication();

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">
            <Link to="/app">Login</Link>
          </Button>
        </div>
      </form>
    </main>
  );
}
