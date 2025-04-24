import React, { useState } from "react";
import "../App.css";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://leetcodeprojv2.onrender.com/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="wrap">
            <button className="logout-btn" onClick={onClose}>
              Exit
            </button>
            <div className="pad"></div>
          </div>
          {!showSuccess ? (
            <>
              <h3>Reset your password</h3>
              <form onSubmit={handleReset}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="button-row">
                  <button className="primary" type="submit">
                    Send reset link
                  </button>
                </div>
              </form>
              {error && <p className="error">{error}</p>}
            </>
          ) : (
            <>
              <h3>Password Reset</h3>
              <p className="success">
                ✅ A temporary password was sent to your email. You can now log
                in with it.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;
