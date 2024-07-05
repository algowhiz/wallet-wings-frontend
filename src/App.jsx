import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Unauthorized from './pages/ErrorPages/Unauthorized';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    useEffect(() => {
        const loggedIn = localStorage.getItem('userData');
        setIsLoggedIn(!!loggedIn);
    }, [isLoggedIn]);

    return (
        <div className="app-container">
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <Home
                                isLoggedIn={isLoggedIn}
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        ) : (
                            <Unauthorized
                            code={'404'}
                            text1={'Page Not Found'}
                            text3={'This Page does not exist'}
                            text4={'Click here'}
                            text5={'to go to the '}
                            text6={'Login page'}
                            route={'/auth'}
                        />
                        )
                    }
                />
                <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
                <Route
                    path="*"
                    element={
                        <Unauthorized
                            code={'404'}
                            text1={'Page Not Found'}
                            text3={'This Page does not exist'}
                            text4={'Click here'}
                            text5={'to go to the '}
                            text6={'Home page'}
                            route={'/'}
                        />
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
