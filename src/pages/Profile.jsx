import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Profile = ({ showToast }) => {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [address, setAddress] = useState({
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zip: user?.address?.zip || ""
    });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showSecurity, setShowSecurity] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingPincode, setFetchingPincode] = useState(false);
    const [error, setError] = useState("");

    // Auto-identify city and state based on pincode
    useEffect(() => {
        const fetchLocation = async () => {
            if (address.zip && address.zip.length === 6) {
                try {
                    setFetchingPincode(true);
                    const res = await fetch(`https://api.postalpincode.in/pincode/${address.zip}`);
                    const data = await res.json();

                    if (data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice[0];
                        setAddress(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }));
                    }
                } catch (err) {
                    console.error("Pincode lookup failed", err);
                } finally {
                    setFetchingPincode(false);
                }
            }
        };

        fetchLocation();
    }, [address.zip]);

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
                    address,
                    ...(password && { password })
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update local user state
                const updatedUser = { ...user, name: data.name, address: data.address };
                login(updatedUser, token);
                showToast("✓ Profile updated successfully");
                setPassword("");
                setConfirmPassword("");
                setShowSecurity(false);
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
            <div className="login-box" style={{ maxWidth: "600px", width: "95%" }}>
                <h2 className="login-title">My Account</h2>
                <p className="login-subtitle">Manage your personal information and shipping address</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleUpdateProfile} className="login-form">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Email Address</label>
                            <input type="email" value={user?.email || ""} disabled style={{ backgroundColor: "#f3f4f6", cursor: "not-allowed" }} title="Email cannot be changed" />
                        </div>

                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your Name"
                                required
                            />
                        </div>

                        <h3 style={{ gridColumn: "span 2", fontSize: "var(--font-size-sm)", color: "var(--color-primary)", marginTop: "var(--space-md)", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "var(--space-xs)" }}> Shipping Address</h3>

                        <div className="form-group" style={{ gridColumn: "span 2" }}>
                            <label>Street Address</label>
                            <input
                                type="text"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                placeholder="City"
                            />
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                placeholder="State"
                            />
                        </div>

                        <div className="form-group">
                            <label>Zip Code {fetchingPincode && <span style={{ color: "var(--color-primary)", fontSize: "10px" }}>(Looking up...)</span>}</label>
                            <input
                                type="text"
                                value={address.zip}
                                onChange={(e) => setAddress({ ...address, zip: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                                placeholder="Zip"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: "var(--space-lg)", borderTop: "1px solid var(--color-border-light)", paddingTop: "var(--space-md)" }}>
                        <button
                            type="button"
                            onClick={() => setShowSecurity(!showSecurity)}
                            style={{
                                background: "none", border: "none", color: "var(--color-primary)",
                                cursor: "pointer", fontSize: "var(--font-size-xs)", fontWeight: "bold",
                                display: "flex", alignItems: "center", gap: "5px", padding: 0
                            }}
                        >
                            {showSecurity ? "▼ Hide Security Tools" : "▶ Account Security Tools"}
                        </button>

                        {showSecurity && (
                            <div className="fade-in" style={{ marginTop: "var(--space-md)", backgroundColor: "#f9fafb", padding: "15px", borderRadius: "8px" }}>
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
                        )}
                    </div>

                    <button type="submit" className="login-button" style={{ marginTop: "var(--space-lg)" }} disabled={loading}>
                        {loading ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
