import { Link } from 'react-router-dom';
const Footer =()=>{
    return(
<footer className="bg-black text-white text-center py-4">
        <div className="container">
          <p className="mb-1">&copy; 2025 Nikee. All rights reserved.</p>
          <div className="d-flex justify-content-center gap-4">
            <Link  className="text-decoration-none text-white">About</Link>
            <Link  className="text-decoration-none text-white">Products</Link>
            <Link  className="text-decoration-none text-white">Contact</Link>
          </div>
        </div>
      </footer>
    )
}
export default Footer;