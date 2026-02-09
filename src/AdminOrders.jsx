import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("https://shop-backend-yvk4.onrender.com/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          style={{
            border: "1px solid #ddd",
            marginBottom: 15,
            padding: 10,
            borderRadius: 6
          }}
        >
          <h3>Total: ₹{order.total}</h3>

          {order.items.map((item, i) => (
            <div key={i}>
              {item.name} × {item.qty}
            </div>
          ))}

          <small>
            {new Date(order.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
