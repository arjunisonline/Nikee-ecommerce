import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const OrderPlacement = () => {
  const API_BASE = process.env.API_BASE;
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.productId;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!productId) return;

    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${API_BASE}/api/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProduct(productRes.data.product);

        const userRes = await axios.get(`${API_BASE}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data.user);
      } catch (err) {
        setMessage("Failed to fetch data");
      }
    };

    fetchData();
  }, [productId]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${API_BASE}/api/checkout/${productId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Order placed successfully");
      navigate("/orders");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-4">Checkout</h2>
      {message && <p className="text-danger text-center">{message}</p>}

      <div className="row g-5">
        {/* Billing and Shipping Info */}
        <div className="col-lg-7">
          <div className="card shadow-sm p-4">
            <h5 className="mb-4 fw-semibold">Billing & Shipping Information</h5>

            <div className="row mb-3">
              <div className="col">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control-plaintext" value={user?.name || ""} readOnly />
              </div>
              <div className="col">
                <label className="form-label">Email</label>
                <input type="email" className="form-control-plaintext" value={user?.email || ""} readOnly />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <input type="text" className="form-control-plaintext" value={user?.address}/>
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="tel" className="form-control-plaintext" value={user?.number} />
            </div>

            <hr className="my-4" />
            <h5 className="mb-3 fw-semibold">Payment Method</h5>
            <div className="form-check mb-2">
              <input className="form-check-input" type="radio" name="payment" id="cod" defaultChecked />
              <label className="form-check-label" htmlFor="cod">Cash on Delivery</label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-lg-5">
          <div className="card shadow-sm p-4">
            <h5 className="mb-4 fw-semibold">Order Summary</h5>

            {product ? (
              <>
                <div className="d-flex justify-content-between mb-2">
                  <span>{product.name}</span>
                  <span>₹{product.price}</span>
                </div>
                <div className="d-flex justify-content-between border-top pt-2 fw-bold">
                  <span>Total</span>
                  <span>₹{product.price}</span>
                </div>
              </>
            ) : (
              <p>No product selected</p>
            )}

            <button className="btn btn-success w-100 mt-4" onClick={handleCheckout}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPlacement;
