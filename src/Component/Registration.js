import React, { useState } from "react";
import logo from '../PNG/Logo.png'
import '../Style/Registration.css';
import ParticlesBackground from "./ParticlesBackground";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export const Registration = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        role: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const { role, username, email, password, confirmPassword } = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/register", {
                role,
                username,
                email,
                password
            });

            alert("Registration Successful!");
            navigate("/"); 

        } catch (error) {
            console.error(error);
            alert("Registration Failed!");
        }
    };

    return (
        <div className="page">
            <ParticlesBackground />
            <img src={logo} alt="F2M Logo" className="logo" />
            <h1 className="RheaderL">Registration</h1>
            <form className="formL" onSubmit={onSubmit}>

                <div className='role-section'>
                    <label>
                        <input type="radio" name="role" value="FARMER"
                            onChange={onInputChange} required />
                        FARMER
                    </label>

                    <label>
                        <input type="radio" name="role" value="BUSINESSMAN"
                            onChange={onInputChange} required />
                        BUSINESSMAN
                    </label>

                    <label>
                        <input type="radio" name="role" value="TRANSPORTER"
                            onChange={onInputChange} required />
                        TRANSPORTER
                    </label>
                </div>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={onInputChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={onInputChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={onInputChange}
                    required
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={onInputChange}
                    required
                />

                <button type="submit">Register</button>

                <p>
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Registration;
