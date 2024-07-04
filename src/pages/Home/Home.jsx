import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { MdDelete, MdEdit, MdFileDownload, MdFileUpload } from "react-icons/md";
import axios from 'axios';
import { downloadCSV } from '../../utils/downloadCSV';
import { parseCSV } from '../../utils/parseCSV';
import Unauthorized from '../ErrorPages/Unauthorized';
import ExpenseForm from '../ExpenseForm/ExpenseForm';
import Spinner from '../../components/spinner/Spinner';

const Home = ({ setIsLoggedIn, isLoggedIn }) => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [showExpenseForm, setShowExpenseForm] = useState(false);
    const [chunkSize, setChunkSize] = useState(5);
    const [currentIndex, setCurrentIndex] = useState(chunkSize);
    const [isFetching, setIsFetching] = useState(false);
    const userId = JSON.parse(localStorage.getItem('userData'))?.user?._id;


    useEffect(() => {
        fetchTransactions(0, chunkSize);
    }, [chunkSize]);

   
    const handleScroll = useCallback(() => {
        if (isFetching || window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
            return;
        }
        fetchMoreTransactions();
    }, [isFetching, currentIndex]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

   
    const fetchTransactions = async (skip, limit) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://wallet-wings.onrender.com/api/transactions/${userId}?skip=${skip}&limit=${limit}`);
            setExpenses(prevExpenses => [...prevExpenses, ...response.data]);
            setCurrentIndex(prevIndex => prevIndex + limit);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreTransactions = () => {
        setIsFetching(true);
        fetchTransactions(currentIndex, chunkSize)
            .then(() => setIsFetching(false))
            .catch(error => {
                console.error('Error fetching more transactions:', error);
                setIsFetching(false);
            });
    };

   
    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/auth');
    };

   
    const handleDownload = () => {
        downloadCSV(expenses);
    };

    
    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target.result;
                const transactions = parseCSV(text);

                if (transactions.length === 0) {
                    console.error('No valid transactions found in the file.');
                    return;
                }

                const response = await axios.post('https://wallet-wings.onrender.com/api/transactions/bulk', {
                    userId: userId,
                    transactions: transactions
                });
                fetchTransactions(0, chunkSize);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        };
        reader.readAsText(file);
    };

  
    const handleDelete = async (index) => {
        const transactionId = expenses[index]._id;

        try {
            await axios.delete(`https://wallet-wings.onrender.com/api/transactions/${transactionId}`);
            const updatedExpenses = expenses.filter(expense => expense._id !== transactionId);
            setExpenses(updatedExpenses);
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
        setConfirmDeleteIndex(null);
    };

    const cancelDelete = () => {
        setConfirmDeleteIndex(null);
    };

 
    const editExpense = (index) => {
        setEditIndex(index);
        setShowExpenseForm(true);
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
        setShowExpenseForm(false);
    };

  
    const addExpense = (expense) => {
        const newExpenses = [...expenses, expense];
        setExpenses(newExpenses);
        setShowExpenseForm(false);
    };

  
    const cancelEdit = () => {
        setEditIndex(null);
        setShowExpenseForm(false);
    };

    const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

    return (
        isLoggedIn ?
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Home Finance App</h1>
                </header>
                <div className={styles.buttonContainerRightSide}>
                    <button
                        onClick={handleLogout}
                        className={styles.button}
                    >
                        Logout
                    </button>
                </div>
                {expenses?.length > 0 && (
                    <div className={styles.downloadCSV}>
                        <button
                            type="button"
                            onClick={handleDownload}
                            className={styles.csv}
                        >
                            <p>CSV</p><p><MdFileDownload size={27} /></p>
                        </button>
                        <input type="file" accept=".csv" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
                        <label htmlFor="upload-input" className={styles.uploadCSV}>
                            <MdFileUpload size={27} /><p> CSV</p>
                        </label>
                    </div>
                )}
                {!expenses.length > 0 && <div className={styles.buttonContainerRightSide}>
                    <button
                        onClick={() => setShowExpenseForm(true)}
                        className={styles.button}
                    >
                        Add Transaction
                    </button>
                    <input type="file" accept=".csv" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
                    <label htmlFor="upload-input" className={styles.uploadCSV}>
                        <MdFileUpload size={27} /><p> CSV</p>
                    </label>
                </div>}
                <div className={styles.expenseContainer}>
                    {expenses.length > 0 ? (
                        expenses.map((expense, index) => (
                            <div key={index} className={styles.expenseItem}>
                                <div className={styles.flexContainer}>
                                    <p className={styles.expenseDescription}>{expense.description}</p>
                                    <p className={styles.expenseAmount}>Amount: ₹ {expense.amount.toLocaleString()}</p>
                                </div>
                                <div className={styles.expenseDate}>
                                    <span>{expense.date}</span>
                                    <div className={styles.actions}>
                                        <button onClick={() => editExpense(index)} className={styles.editButton}>
                                            <MdEdit />
                                        </button>
                                        <button onClick={() => setConfirmDeleteIndex(index)} className={styles.deleteButton}>
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.noExpenses}>No Transactions to show</p>
                    )}
                    {isFetching && <Spinner />}
                </div>
                {totalExpense !== 0 && (
                    <div className={styles.totalExpense}>
                        <p>Total Expense: ₹ {totalExpense.toLocaleString()}</p>
                    </div>
                )}
                {expenses.length > 0 && <div className={styles.buttonContainer}>
                    <button
                        onClick={() => setShowExpenseForm(true)}
                        className={styles.button}
                    >
                        Add Transaction
                    </button>
                </div>}
                {confirmDeleteIndex !== null && (
                    <div className={styles.overlay}>
                        <div className={styles.confirmDelete}>
                            <div>
                                <p>Are you sure you want to delete this transaction?</p>
                            </div>
                            <div className={styles.confirmation}>
                                <button className={styles.no} onClick={cancelDelete}>No</button>
                                <button className={styles.yes} onClick={() => handleDelete(confirmDeleteIndex)}>Yes</button>
                            </div>
                        </div>
                    </div>
                )}
                {showExpenseForm && (
                    <div className={styles.overlay}>
                        <ExpenseForm
                            addExpense={addExpense}
                            updateExpense={updateExpense}
                            cancelEdit={cancelEdit}
                            editIndex={editIndex}
                            existingExpense={expenses[editIndex]}
                        />
                    </div>
                )}
            </div> :
            <Unauthorized
                code={'401'}
                text1={'Unauthorized'}
                text2={'Access Denied'}
                text3={'You are not authorized to access this page'}
                text4={'Click here'}
                text5={'to go to the '}
                text6={'Login page'}
                route={'/auth'}
            />
    );
};

export default Home;
