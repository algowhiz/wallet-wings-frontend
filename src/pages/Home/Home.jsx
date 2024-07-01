import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import { MdDelete, MdEdit, MdFileDownload, MdFileUpload } from "react-icons/md";
import axios from 'axios';
import { downloadCSV } from '../../utils/downloadCSV';
import { parseCSV } from '../../utils/parseCSV';

const Home = ({
  formatAmount,
  editExpense,
  updateExpense,
  cancelEdit,
  editIndex,
  setExpenses,
  expenses
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const userId = localStorage.getItem('userData');
  const data = JSON.parse(userId);
  const id = data?.user?._id;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://wallet-wings.onrender.com/api/transactions/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);

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
  
        const userId = JSON.parse(localStorage.getItem('userData')).user._id;
        const response = await axios.post('https://wallet-wings.onrender.com/api/transactions/bulk', {
          userId: userId,
          transactions: transactions
        });
        fetchTransactions();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    };
    reader.readAsText(file);
  };
  
  

  const handleDelete = async (index) => {
    const transactionId = expenses[index]._id;

    try {
      const response = await axios.delete(`https://wallet-wings.onrender.com/api/transactions/${transactionId}`);
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

  const handelLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('expenses');
    navigate('/auth')
  }

  const addExpense = async (expense) => {
    try {
      const userId = JSON.parse(localStorage.getItem('userData')).user._id;
      const response = await axios.post('https://wallet-wings.onrender.com/api/transactions', { userId, expense });
      setExpenses(prevExpenses => [...prevExpenses, response.data]);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Home Finance App</h1>
      </header>
      <div className={styles.buttonContainerRightSide}>
        <button
          onClick={handelLogout}
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
            <p>CSV</p><p><MdFileDownload size={30} /></p>
          </button>
          <input type="file" accept=".csv" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
          <label htmlFor="upload-input" className={styles.uploadCSV}>
            <MdFileUpload size={30} /><p> CSV</p>
          </label>
        </div>
      )}
      {!expenses.length > 0 && <div className={styles.buttonContainerRightSide}>
        <button
          onClick={() => navigate('/expenseform')}
          className={styles.button}
        >
          Add Transaction
        </button>
        <input type="file" accept=".csv" onChange={handleUpload} style={{ display: 'none' }} id="upload-input" />
          <label htmlFor="upload-input" className={styles.uploadCSV}>
            <MdFileUpload size={30} /><p> CSV</p>
          </label>
      </div>}
      <div className={styles.expenseContainer}>
        {loading ? (
          <p>Loading transactions...</p>
        ) : expenses.length > 0 ? (
          expenses.map((expense, index) => (
            <div key={index} className={styles.expenseItem}>
              <div className={styles.flexContainer}>
                <p className={styles.expenseDescription}>{expense.description}</p>
                <p className={styles.expenseAmount}>Amount: ₹ {formatAmount(expense.amount)}</p>
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
      </div>
      {totalExpense !== 0 && (
        <div className={styles.totalExpense}>
          <p>Total Expense: ₹ {formatAmount(totalExpense)}</p>
        </div>
      )}
      {expenses.length > 0 && <div className={styles.buttonContainer}>
        <button
          onClick={() => navigate('/expenseform')}
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
      {editIndex !== null && (
        <ExpenseEditModal
          expense={expenses[editIndex]}
          updateExpense={updateExpense}
          cancelEdit={cancelEdit}
        />
      )}
    </div>
  );
};

export default Home;
