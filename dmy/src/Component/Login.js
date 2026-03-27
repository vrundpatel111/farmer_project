import React, { useState } from "react";
import logo from "../PNG/Logo.png";
import handshakeImage from "../PNG/Farmer.png";
import "../Style/Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        role: "",
        email: "",
        password: ""
    });

    const { role, email, password } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!role) {
            alert("Please select your role");
            return;
        }

        try {
            const result = await axios.post("http://localhost:8080/api/login", { email, password });
            const loggedInUser = result.data;

            if (loggedInUser.role !== role) {
                alert("Selected role does not match your account role!");
                return;
            }

            localStorage.setItem("user", JSON.stringify(loggedInUser));
            localStorage.setItem("userId", loggedInUser.id);

            switch (loggedInUser.role) {
                case "FARMER": navigate("/farmer-dashboard"); break;
                case "BUSINESSMAN": navigate("/business-dashboard"); break;
                case "TRANSPORTER": navigate("/transporter-dashboard"); break;
                default: navigate("/");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Invalid Email or Password!");
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-content-container">
               

                {/* Right Side: Login Form */}
                <div className="right-section">
                    <h1 className="headerL">Login</h1>

                    <div className="login-card">
                        <form onSubmit={onSubmit} className="formL">
                            <div className="role-section">
                                <label className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="FARMER"
                                        checked={role === "FARMER"}
                                        onChange={onInputChange}
                                        required
                                    />
                                    FARMER
                                </label>
                                <label className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="BUSINESSMAN"
                                        checked={role === "BUSINESSMAN"}
                                        onChange={onInputChange}
                                        required
                                    />
                                    BUSINESSMAN
                                </label>
                                <label className="role-option">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="TRANSPORTER"
                                        checked={role === "TRANSPORTER"}
                                        onChange={onInputChange}
                                        required
                                    />
                                    TRANSPORTER
                                </label>
                            </div>

                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="Email"
                                value={email}
                                onChange={onInputChange}
                                required
                            />

                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={onInputChange}
                                required
                            />

                            <button type="submit" className="login-submit-btn">Login</button>

                            <p className="register-footer">
                                Don't have an account? <Link to="/register" style={{color:"brown"}}>Register</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;