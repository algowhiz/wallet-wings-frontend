import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import ExpenseForm from './pages/ExpenseForm/ExpenseForm';
import Auth from './pages/Auth/Auth';
import Unauthorized from './pages/ErrorPages/Unauthorized';

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('userData');
        setIsLoggedIn(loggedIn); 
    }, [isLoggedIn]);

    useEffect(() => {
        const storedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        setExpenses(storedExpenses);
    }, []);

    const formatAmount = (amount) => {
        let formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        formattedAmount = formattedAmount.replace(/\B(?=(\d{4})+(?!\d))/g, ',');
        return formattedAmount;
    };

    const addExpense = (expense) => {
        const newExpenses = [...expenses, expense];
        setExpenses(newExpenses);
        navigate('/');
    };

    const deleteExpense = (index) => {
        setConfirmDeleteIndex(index);
    };

    const confirmDelete = () => {
        const newExpenses = expenses.filter((_, i) => i !== confirmDeleteIndex);
        setExpenses(newExpenses);
        localStorage.setItem('expenses', JSON.stringify(newExpenses));
        setConfirmDeleteIndex(null);
    };

    const cancelDelete = () => {
        setConfirmDeleteIndex(null);
    };

    const editExpense = (index) => {
        setEditIndex(index);
        navigate('/expenseform');
    };

    const updateExpense = (updatedExpense) => {
        const updatedExpenses = [...expenses];
        const currentDateTime = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
        };
        updatedExpenses[editIndex] = { ...updatedExpense, ...currentDateTime };
        setExpenses(updatedExpenses);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        setEditIndex(null);
        navigate('/');
    };

    const cancelEdit = () => {
        setEditIndex(null);
        navigate('/');
    };

    return (
        <div className="app-container">
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <Home
                                expenses={expenses}
                                setExpenses={setExpenses}
                                formatAmount={formatAmount}
                                deleteExpense={deleteExpense}
                                editExpense={editExpense}
                                confirmDelete={confirmDelete}
                                cancelDelete={cancelDelete}
                                confirmDeleteIndex={confirmDeleteIndex}
                                cancelEdit={cancelEdit}
                                updateExpense={updateExpense}
                                editIndex={editIndex}
                            />
                        ) : (
                            <Unauthorized
                                code={'403'}
                                text1={'Unauthorized'}
                                text2={'access'}
                                text3={'You are not logged in'}
                                text4={'Click here'}
                                text5={'to go to the '}
                                text6={' login page'}
                                route={'/auth'}
                            />
                        )
                    }
                />
                <Route
                    path="/expenseform"
                    element={
                        isLoggedIn ? (
                            <ExpenseForm
                                addExpense={addExpense}
                                editIndex={editIndex}
                                expenses={expenses}
                                updateExpense={updateExpense}
                                cancelEdit={cancelEdit}
                            />
                        ) : (
                            <Unauthorized
                                code={'403'}
                                text1={'Unauthorized'}
                                text2={'access'}
                                text3={'You are not logged in'}
                                text4={'Click here'}
                                text5={'to go to the '}
                                text6={' login page'}
                                route={'/auth'}
                            />
                        )
                    }
                />
                <Route path="/auth" element={<Auth />} />
                <Route
                    path="*"
                    element={<Unauthorized
                        code={'404'}
                        text1={'Page Not Found'}
                        text3={'This Page does not exist'}
                        text4={'Click here'}
                        text5={'to go to the '}
                        text6={' Home page'}
                        route={'/'}
                    />}
                />
            </Routes>
        </div>
    );
};

export default App;
