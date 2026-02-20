import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => {
        console.log("Orders:", data);
        setOrders(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(
        `https://shop-backend-yvk4.onrender.com/api/orders/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      const res = await fetch(
        "https://shop-backend-yvk4.onrender.com/api/orders"
      );
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  const getStatusClass = (status) => {
    return status ? status.toLowerCase() : "pending";
  };

  return (
    <div className="admin-orders-page">
      <h2 className="admin-orders-title">📦 Order Management</h2>

      {orders.length === 0 && (
        <div className="error-container">
          <div className="error-icon">📋</div>
          <p className="error-message">No orders yet</p>
          <p className="error-hint">Orders will appear here when customers place them.</p>
        </div>
      )}

      {orders.map((order) => (
        <div key={order._id} className="admin-order-card">
          <div className="admin-order-header">
            <div>
              <span className="admin-order-id">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <br />
              <span className="admin-order-date">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className={`status-badge ${getStatusClass(order.status)}`}>
                {order.status}
              </span>

              <select
                className="admin-status-select"
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <span className="admin-order-total">₹{order.total?.toLocaleString()}</span>
          </div>

          <ul className="admin-order-items">
            {order.items.map((item, i) => (
              <li key={i}>
                • {item.name} × {item.qty} — ₹{(item.price * item.qty).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
