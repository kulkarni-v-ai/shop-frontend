import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../styles/Login.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(API.defaults.baseURL + "/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("If an account with that email exists, we have sent a password reset link.");
                setEmail("");
            } else {
                setError(data.message || "Failed to process request");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Reset Password</h2>
                <p className="login-subtitle">Enter your email and we'll send you a link to reset your password</p>

                {error && <div className="error-message">{error}</div>}
                {message && <div style={{ padding: "12px", marginBottom: "20px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "6px", fontSize: "14px", textAlign: "center" }}>{message}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="login-footer">
                    Remembered your password? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
