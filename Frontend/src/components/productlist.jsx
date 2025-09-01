import FilterModal from "./filterModal";
import Navbar from "./navbar";
import Footer from "./reusable-pages/footer";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const API_BASE = process.env.API_BASE;
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    brand: {},

  });

  const fetchProducts = useCallback(async () => {
    const token = localStorage.getItem("token");
    const selectedBrands = Object.entries(filters.brand)
      .filter(([_, val]) => val)
      .map(([key]) => key);

    const params = new URLSearchParams({
      page: currentPage,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      brand: selectedBrands.join(","),
      name: searchTerm,
    });

    try {
      const res = await axios.get(`${API_BASE}/api/products?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(res.data.productList || []);
      setTotalPage(res.data.totalPage || 1);
    } catch (err) {
      console.error(err);
      setMessage('Failed to retrieve products');
    }
  }, [currentPage, filters, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddCart = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE}/api/addtocart/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Added to cart!");
    } catch (err) {
      setMessage("Failed to add to cart");
    }
  };

  const handleBuy = (productId) => {
    navigate('/checkout', { state: { productId } });
  };

  const viewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div>
      <Navbar />
      <div className="container-fluid py-5 flex-grow-1 min-vh-100">
        {message?(<div class="alert alert-primary" role="alert">
          {message}
        </div>):null}
        <div className="row">
          <div className="col mx-3">
            <div className="d-flex mx-3 gap-3 justify-content-end">
              <FilterModal filters={filters} setFilters={setFilters} onApply={fetchProducts} />
              <form onSubmit={(e) => {
                e.preventDefault();
                setCurrentPage(1);
                fetchProducts();
              }}>

                <input
                  className="form-control w-sm w-sm-50"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

              </form>
            </div>
          </div>
        </div>

        <div className="row mx-3 my-4">
          {products.length === 0 ? (
            <p className="text-danger">{message || "No products found"}</p>
          ) : (
            products.map((product) => (
              <div className="col-sm col-12 my-3" key={product._id}>
                <div className="card h-100">
                  <button
                    className="text-decoration-none text-dark border-0 bg-transparent p-0 text-start"
                    onClick={() => viewProduct(product._id)}
                  >
                    <img
                      src={`data:${product.image.contentType};base64,${product.image.data}`}
                      className="card-img-top"
                      alt="Product"
                      style={{ height: "250px", objectFit: "cover" }}
                    />

                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">Price: ₹{product.price}</p>
                    </div>
                  </button>
                  <div className="card-footer">
                    <div className="d-flex flex-column gap-2">
                      <button className="btn btn-primary" onClick={() => handleAddCart(product._id)}>Add to Cart</button>
                      <button className="btn btn-success" onClick={() => handleBuy(product._id)}>Buy Now</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
              Previous
            </button>
          </li>

          {Array.from({ length: totalPage }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPage))}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <Footer />
    </div>
  );
}

export default ProductList;
