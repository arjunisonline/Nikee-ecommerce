import Navbar from "./navbar";
import Footer from "./reusable-pages/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OrderHistory = () => {
  const API_BASE = process.env.API_BASE;
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("order data:", res.data.orders);
        setOrderItems(res.data.orders || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to retrieve orders");
      }
    };
    fetchOrder();
  }, []);
  return (
    <div>
      <Navbar />

      <section className="min-vh-100 d-flex align-items-start bg-light py-5">
        <div className="container">
          <h2 className="mb-4 text-center fw-bold">Your Orders</h2>
          <p className="text text-danger">{message}</p>
          <div className="alert alert-sucess">{location.state?.message}</div>
          {orderItems.map((item, index) => (
            <div className="card shadow-sm mb-3" key={index}>
              <div className="row border-bottom py-4 px-2 align-items-center g-3">
                <div className="col-12 col-md-2 text-center">
                  <img
                    src={`data:${item.image.contentType};base64,${item.image.data}`}
                    alt="Product"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "100px", objectFit: "contain" }}
                  />
                </div>

                <div className="col-12 col-md-4 text-md-start text-center">
                  <h6 className="fw-semibold mb-1">{item.name || "Unknown Product"}</h6>
                  <p className="text-muted mb-0">Order Date: {new Date(item.orderDate).toLocaleDateString()}</p>
                </div>

                <div className="col-12 col-md-3 text-md-start text-center">
                  <h6 className="fw-semibold mb-1">Status</h6>
                  <p className={`mb-0 ${item.status === "pending" ? "text-warning" : "text-danger"}`}>
                    {item.status}
                  </p>
                </div>

                <div className="col-12 col-md-3 text-md text-center">
                 <h6 className="fw-semibold mb-1">Quantity</h6>
                  <p className="mb-0 text-center" >
                    {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}


        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OrderHistory;
