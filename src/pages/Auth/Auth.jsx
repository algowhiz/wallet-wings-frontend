import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import Toast from '../../components/toast/Toast';
import Spinner from '../../components/spinner/Spinner'; 

const Auth = ({ setIsLoggedIn }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastDescription, setToastDescription] = useState('');
    const [toastColor, setToastColor] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setShowToast(false);

        try {
            if (isLogin) {
                const res = await axios.post('https://wallet-wings.onrender.com/api/auth/login', {
                    email: formData.email,
                    password: formData.password
                });
                localStorage.setItem('userData', JSON.stringify(res.data));
                setIsLoggedIn(true);
                setToastMessage('Login successful!');
                setToastDescription('You are now logged in.');
                setToastColor('green');
                setShowToast(true);
                navigate('/');
            } else {
                const res = await axios.post('https://wallet-wings.onrender.com/api/auth/signup', {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                setToastMessage('Signup successful!');
                setToastDescription('Please login with your new account.');
                setToastColor('green'); 
                setShowToast(true);
                setIsLogin(true);
            }
        } catch (err) {
            setToastMessage('Authentication failed.');
            setToastDescription('Please try again.');
            setToastColor('red');
            setShowToast(true);
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            {showToast && (
                <Toast
                    message={toastMessage}
                    description={toastDescription}
                    onClose={() => setShowToast(false)}
                    color={toastColor} 
                />
            )}
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
                    <button type="submit" style={{ position: 'relative' }}>
                    {loading ? <Spinner /> : (isLogin ? 'Login' : 'Signup')}
                    </button>
                    <p className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
                    </p>
                </form>
            </div>
        </>
    );
};

export default Auth;
