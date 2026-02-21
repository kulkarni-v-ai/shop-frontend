import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = ({ showToast }) => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (password && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("https://shop-backend-yvk4.onrender.com/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name,
                    ...(password && { password })
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user state
                const updatedUser = { ...user, name: data.name };
                login(updatedUser, token);
                showToast("✓ Profile updated successfully");
                setPassword("");
                setConfirmPassword("");
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box" style={{ maxWidth: "500px" }}>
                <h2 className="login-title">My Profile</h2>
                <p className="login-subtitle">Update your account information</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleUpdateProfile} className="login-form">
                    <div className="form-group">
                        <label>Email Address (Cannot be changed)</label>
                        <input type="email" value={user?.email || ""} disabled style={{ backgroundColor: "#f3f4f6" }} />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div style={{ marginTop: "var(--space-lg)", paddingTop: "var(--space-md)", borderTop: "1px solid var(--color-border-light)" }}>
                        <p style={{ fontSize: "var(--font-size-xs)", fontWeight: "bold", color: "var(--color-text-light)", marginBottom: "var(--space-sm)" }}>
                            CHANGE PASSWORD (Leave blank to keep current)
                        </p>

                        <div className="form-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
