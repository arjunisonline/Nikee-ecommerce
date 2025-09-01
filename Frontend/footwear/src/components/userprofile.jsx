import { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

const UserProfile = () => {
  const API_BASE = process.env.API_BASE;
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [message, setMessage] = useState('');

  const handlePassword = async () => {
    if (newPass !== confirmNewPass) {
      setMessage("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE}/api/changepass`,
        {
          currentPassword: currentPass,
          newPassword: newPass
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessage(res.data.message || "Password updated successfully");
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-4">User Profile</h2>
        {message && <h4 className="text-danger text-center">{message}</h4>}
        <div className="row mx-auto">
          <div className="card shadow-sm p-4 w-md-25 mx-auto">
            <h5 className="mb-3 fw-semibold">Change Password</h5>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setCurrentPass(e.target.value)}
                value={currentPass}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setNewPass(e.target.value)}
                value={newPass}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setConfirmNewPass(e.target.value)}
                value={confirmNewPass}
              />
            </div>
            <div className="text-center">
              <button
                className="btn btn-warning w-50 mt-2"
                onClick={handlePassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
