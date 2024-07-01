import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await axios.post('https://wallet-wings.onrender.com/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('userData', JSON.stringify(res.data)); // Store user data
                alert('Login successful!'); // Display a success message
                navigate('/');
            } else {
                const res = await axios.post('https://wallet-wings.onrender.com/api/auth/signup', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                setIsLogin(true);
                alert('Signup successful! Please login.'); // Display a success message
            }
        } catch (err) {
            console.error(err.response.data);
            alert('Authentication failed. Please try again.'); // Display an error message
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>{isLogin ? 'Login to WalletWings' : 'Signup to WalletWings'}</h2>
                <div>
                    {!isLogin && (
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
                <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
                <p className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Switch to Signup' : 'Switch to Login'}
                </p>
            </form>
        </div>
    );
};

export default Auth;
