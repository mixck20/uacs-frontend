import React, { useState } from "react";
import uacsUndraw from "../assets/uacs_undraw.svg";
import "./Signup.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaIdCard, 
  FaLock, 
  FaBell, 
  FaUserTie, 
  FaGraduationCap,
  FaVenusMars,
  FaChevronDown
} from "react-icons/fa";
import { MdPerson, MdEmail, MdLock, MdNotifications } from "react-icons/md";

const Signup = ({ onSwitch }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    role: "",
    email: "",
    idNumber: "",
    password: "",
    confirmPassword: "",
    emailUpdates: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <div className="signup-left">
          <h1 className="signup-title">REGISTER</h1>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-row">
              <div className="signup-input-container">
                <MdPerson className="signup-input-icon" />
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
              <div className="signup-input-container">
                <MdPerson className="signup-input-icon" />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <FaVenusMars className="signup-input-icon" />
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="signup-input signup-select"
                  required
                >
                  <option value="" disabled>Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <FaChevronDown className="signup-select-arrow" />
              </div>
              <div className="signup-input-container">
                <FaGraduationCap className="signup-input-icon" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="signup-input signup-select"
                  required
                >
                  <option value="" disabled>Roles</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
                <FaChevronDown className="signup-select-arrow" />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <MdEmail className="signup-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="School email (ua.edu.ph)"
                  value={form.email}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <FaIdCard className="signup-input-icon" />
                <input
                  type="text"
                  name="idNumber"
                  placeholder="Student/Faculty Number ID"
                  value={form.idNumber}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row">
              <div className="signup-input-container">
                <MdLock className="signup-input-icon" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
              <div className="signup-input-container">
                <MdLock className="signup-input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="signup-input"
                  required
                />
              </div>
            </div>
            <div className="signup-row-checkbox">
              <label className="signup-checkbox-label">
                <input
                  type="checkbox"
                  name="emailUpdates"
                  checked={form.emailUpdates}
                  onChange={handleChange}
                  className="signup-checkbox"
                />
                <MdNotifications className="signup-checkbox-icon" />
                I would like to receive email updates and notifications from the School Clinic.
              </label>
            </div>
            <button type="submit" className="signup-btn">
              Signup
            </button>
          </form>
          <div className="signup-login-link">
            Already have an account?{" "}
            <span onClick={onSwitch} className="signup-login-link-highlight">
              Log in
            </span>
          </div>
        </div>
        <div className="signup-right">
          <img src={uacsUndraw} alt="Clinic Illustration" className="signup-illustration" />
        </div>
      </div>
    </div>
  );
};

export default Signup;