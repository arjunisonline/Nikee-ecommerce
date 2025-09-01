import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./reusable-pages/footer";

const ProductDetailed = () => {
  const API_BASE = process.env.API_BASE;
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data.product);
      } catch (err) {
        setMessage("Failed to load product");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${API_BASE}/api/addtocart/${productId}`,
        { quantity: parseInt(quantity) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout", { state: { productId } });
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5 min-vh-100">
        <h2 className="text-center fw-bold mb-5">Product Details</h2>
        {message && <p className="text-danger text-center">{message}</p>}
        {!product ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <img
                src={`data:${product.image.contentType};base64,${product.image.data}`}
                alt="product"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            </div>

            <div className="col-md-6">
              <h3 className="fw-bold mb-3">{product.name}</h3>
              <h5 className="text-success fw-semibold mb-3">₹{product.price}</h5>
              <p className="text-muted">{product.description || "No description provided."}</p>

              <div className="my-4">
                <label htmlFor="quantity" className="form-label fw-semibold">
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="form-control w-auto"
                />
              </div>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-primary" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="btn btn-success" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailed;
