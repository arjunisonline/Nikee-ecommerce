import { useEffect, useState } from "react";
import axios from "axios";

const FilterModal = ({ filters, setFilters, onApply }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/filters");
        setCategories(res.data.categories || []);
        setBrands(res.data.brands || []);
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    };

    fetchFilters();
  }, []);

  const handleFilter = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        brand: {
          ...prev.brand,
          [value]: checked,
        },
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#filterModal"
      >
        Filter
      </button>

      <div
        className="modal fade"
        id="filterModal"
        tabIndex="-1"
        aria-labelledby="filterModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filterModalLabel">Filter Products</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form>
                {/* Category */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={filters.category}
                    onChange={handleFilter}
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Price Range</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Min"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilter}
                    />
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Max"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilter}
                    />
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Brand</label>
                  {brands.map((brand) => (
                    <div className="form-check" key={brand}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={brand}
                        id={`brand-${brand}`}
                        checked={filters.brand[brand] || false}
                        onChange={handleFilter}
                      />
                      <label className="form-check-label" htmlFor={`brand-${brand}`}>
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onApply}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
