import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [confirmPassword, setConfirmPassword] = useState('');
  var [number, setNumber] = useState('');
  var [address, setAddress] = useState('');
  var [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    if (password !== confirmPassword) {
      setMessage('Password not matched');
      return;
    }

    try {
      var user = {
        name,
        email,
        password,
        address,
        number,
      }
      console.log(user);
      const res = await axios.post('http://localhost:3000/api/signup',user);
      setMessage(res.data.message || 'signup successful');
      navigate('/login');

    } catch (err) {
      setMessage(err.response?.data || 'signup failed');
      console.log(err.response.data)
    }
  }

  return (
    <div className="position-relative vh-100">
      <img
        src={window.location.origin + "/img/bg-shoes.jpg"}
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        alt="background"
        style={{ zIndex: -1 }}
      />

      <div className="container d-flex justify-content-center align-items-center h-100">
        <form className="bg-white bg-opacity-75 p-4 rounded shadow col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" onSubmit={handleSubmit} >
          <h3 className="text-center text-info-emphasis fw-bold mb-4">Signup</h3>
          {message && <p className="text-danger text-center">{message}</p>}

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Name</label>
              <input type="text" className="form-control"  value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" className="form-control"  value={email} onChange={(event) => { setEmail(event.target.value) }} required />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Address</label>
              <input type="text" className="form-control"  value={address} onChange={(event) => { setAddress(event.target.value) }} required />
            </div>
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Number</label>
              <input type="tel" className="form-control"  value={number} onChange={(event) => { setNumber(event.target.value) }} required  maxLength={10}/>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control"  value={password} onChange={(event) => { setPassword(event.target.value) }} required />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input type="password" className="form-control"  value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value) }} required />
            </div>
          </div>

          <div className="text-center d-flex flex-column align-items-center">
            <button type="submit" className="btn btn-primary w-75 mb-2">Signup</button>
            <small className="form-text">
              Have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
