import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExpenseForm.module.css';
import axios from 'axios';

const ExpenseForm = ({ addExpense, editIndex, expenses, updateExpense, cancelEdit }) => {
  const navigate = useNavigate();

 
  const [expense, setExpense] = useState({
    description: '',
    amount: '',
    date: new Date().toLocaleString()
  });

  useEffect(() => {
    if (editIndex !== null && expenses[editIndex]) {
      const { description, amount } = expenses[editIndex];
      setExpense({ description, amount });
    } else {
      setExpense({
        description: '',
        amount: ''
      });
    }
  }, [editIndex, expenses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpense({ ...expense, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.patch(`https://wallet-wings.onrender.com/api/transactions/${expenses[editIndex]._id}`, expense);
        updateExpense(expense);
      } else {
        const response = await axios.post('https://wallet-wings.onrender.com/api/transactions/', { userId: JSON.parse(localStorage.getItem('userData')).user._id, expense });
        addExpense(response.data);
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  return (
    <div className={styles.formContainer}>
      
      <div className={styles.innerFormContainer}>
      <button type="button" onClick={cancelEdit} className={`${styles.button} ${styles.buttonRed}`}>
        Cancel
      </button>
      <h1 className={styles.formTitle}>{editIndex !== null ? 'Edit Expense' : 'Add Expenditure'}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={expense.description}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="amount" className={styles.label}>Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            onChange={handleInputChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.buttonContainer}>
          <button type="submit" className={`${styles.button} ${styles.buttonGreen}`}>
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
