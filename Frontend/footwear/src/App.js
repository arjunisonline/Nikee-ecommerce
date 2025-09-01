import React, { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import Footer from './components/reusable-pages/footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function App() {
  const API_BASE = process.env.API_BASE;
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch random products
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/products/featured`); // your route
        setFeaturedProducts(response.data); // expects array of products
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      }
    };

    fetchProducts();
  }, [navigate]);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="min-vh-100 position-relative overflow-hidden">
        <img
          src={window.location.origin + '/img/nike-bg.jpg'}
          className="w-100 h-100 position-absolute top-0 start-0 object-fit-cover z-n1"
          alt="Nike Background"
        />
        <div className="position-absolute top-50 start-50 translate-middle text-white text-center px-3">
          <h1 className="display-1 fw-bold text-uppercase text-dark text-shadow text-outline-light">
            Own The Ground You Walk On
          </h1>
          <a href="/products"className="btn btn-light btn-lg mt-4 btn-outline-dark">Buy Now</a>
        </div>
      </section>

      {/* About Us */}
      <section className="py-5 bg-light text-dark" id="about">
        <div className="container text-center px-4">
          <h2 className="display-4 fw-bold mb-4">About Us</h2>
          <p className="lead mx-auto" style={{ maxWidth: '700px' }}>
            At Nikee, we blend innovation and style to create footwear that performs and inspires.
            Whether you're on the street or the track, our mission is to elevate your every step.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-5 bg-dark text-white" id="products">
        <div className="container text-center">
          <h2 className="display-4 fw-bold mb-5">Featured Products</h2>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div className="col-12 col-md-4" key={product._id}>
                <div className="card bg-light text-dark h-100">
                  {product.image?.data ? (
                    <img
                      src={`data:${product.image.contentType};base64,${product.image.data}`}
                      className="card-img-top"
                      alt="s"
                    />
                  ) : (
                    <img
                      src="/img/no-image.png"
                      className="card-img-top"
                      alt=""
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.category}</p>
                    <p className="card-text fw-bold">₹{product.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
