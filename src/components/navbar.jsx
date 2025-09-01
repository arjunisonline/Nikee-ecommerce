import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
     const navigate = useNavigate();
  const token = localStorage.getItem("token"); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
    return (
        <nav className="navbar navbar-expand-md">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Nikee</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav d-flex mx-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-dark-emphasis" style={{ cursor: 'pointer' }}>
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/products" className="nav-link text-dark-emphasis" style={{ cursor: 'pointer' }}>
                                Products
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/orders" className="nav-link text-dark-emphasis" style={{ cursor: 'pointer' }}>
                                Orders
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cart" className="nav-link text-dark-emphasis" style={{ cursor: 'pointer' }}>
                                Cart
                            </Link>
                        </li>
                    </ul>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/user" className="nav-link text-dark-emphasis" style={{ cursor: 'pointer' }}>
                                <FaUser />
                            </Link>
                        </li>
                        {token ? (
                            <li className="nav-item">
                                <span
                                    className="nav-link text-dark-emphasis"
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </span>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link to="/login" className="nav-link text-dark-emphasis">
                                    Login
                                </Link>
                            </li>
                        )}

                    </ul>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
