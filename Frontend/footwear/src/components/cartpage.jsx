import { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./reusable-pages/footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const API_BASE = process.env.API_BASE;
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_BASE}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Cart data:", res.data.cart);
      setCartItems(res.data.cart || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to retrieve cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // remove
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/remove/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
      fetchCart();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to remove item");
    }
  };
  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${API_BASE}/api/buycart`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate('/orders',{state:{message:"Order placed successfully!"}})
      setCartItems([]); 
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to place order");
    }
  };


  return (
    <div>
      <Navbar />
      <section className="min-vh-100 align-items-start bg-light p-5">
        <div className="d-flex mx-auto justify-content-end mb-3">
          <button type="button" className="btn btn-success" to="/orders" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
        {message && <div className="alert alert-danger">{message}</div>}

        {cartItems.map((item, index) => (
          <div className="card mb-4 shadow-sm" key={index}>
            <div className="row g-0 flex-column flex-md-row align-items-center align-items-md-start">
              <div className="col-md-4 text-center p-3">
                <img
                  src={`data:${item.image.contentType};base64,${item.image.data}`}
                  className="img-fluid rounded"
                  style={{ maxWidth: "200px", height: "auto" }}
                  alt="product"
                />
              </div>

              <div className="col-md-8 p-3">
                <h5 className="fw-semibold">{item.name}</h5>
                <p className="text-muted mb-2">Size: 10 | Color: Red</p>
                <p className="text-muted mb-2">₹{item.price}</p>
                <p className="text-body-secondary">
                  <small>Last updated 3 mins ago</small>
                </p>
                <div className="d-flex flex-column flex-sm-row gap-2 mt-3">
                  <input type="number" className="form-control w-auto" value={item.quantity} readOnly />
                  <button className="btn btn-outline-danger btn-sm" onClick={() => removeItem(item.productId)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </div>
  );
};

export default CartPage;
