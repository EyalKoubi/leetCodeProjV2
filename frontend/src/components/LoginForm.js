import React, { useState } from "react";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginForm = ({ onSubmit, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p
          className="forgot-password-link"
          onClick={() => setShowForgotModal(true)}
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
            marginTop: "10px",
          }}
        >
          Forgot password?
        </p>
        {error && <p className="error">{error}</p>}
      </form>

      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
};

export default LoginForm;
