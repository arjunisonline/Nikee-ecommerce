import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {

    var [email,setEmail] = useState('')
    var [password,setPassword] = useState('');
    var [message,setMessage] = useState('')
    const navigate = useNavigate();

    const handleLogin = async(q)=>{
        q.preventDefault();

        try{
            const res = await axios.post('http://localhost:3000/api/login',{email,password});
            const token = res.data.token;
            localStorage.setItem('token',token);
            console.log(token);
            navigate('/');

        }catch(err){
            setMessage(err.response.data.message);
        }

    }
    return (
        <div className="position-relative vh-100">
            <img
                src={window.location.origin + '/img/bg-shoes.jpg'}
                className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                alt="background"
                style={{ zIndex: -1 }}
            />

            
            <div className="container d-flex justify-content-center align-items-center h-100">
                <form className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6 p-4 rounded shadow bg-white bg-opacity-75" onSubmit={handleLogin}>
                    <h3 className="text-center text-info-emphasis mb-4">Login</h3>
                     {message && <p className="text-danger text-center">{message}</p>}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input type="email" className="form-control" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>

                    <div className="text-center d-flex flex-column align-items-center">
                        <input type="submit" value="Login" className="btn btn-primary w-75 mb-2" />
                        <small className="form-text">
                            Don’t have an account? <Link to="/signup">Signup</Link>
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
