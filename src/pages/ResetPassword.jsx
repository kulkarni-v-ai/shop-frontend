import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/Login.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(API.defaults.baseURL + `/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password has been successfully reset!");
                setIsSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            } else {
                setError(data.message || "Failed to reset password. The token may be invalid or expired.");
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
                <h2 className="login-title">Create New Password</h2>
                <p className="login-subtitle">Please enter and confirm your new password below</p>

                {error && <div className="error-message">{error}</div>}
                {message && <div style={{ padding: "12px", marginBottom: "20px", backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "6px", fontSize: "14px", textAlign: "center" }}>{message}</div>}

                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>You will be redirected to the login page shortly.</p>
                        <Link to="/login" className="login-button" style={{ display: "inline-block", textDecoration: "none" }}>Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
