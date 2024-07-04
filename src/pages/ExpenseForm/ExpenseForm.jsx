import React, { useState, useEffect } from 'react';
import styles from './ExpenseForm.module.css';

const ExpenseForm = ({ addExpense, updateExpense, cancelEdit, editIndex, existingExpense }) => {
    const [expense, setExpense] = useState({
        description: '',
        amount: ''
    });

    useEffect(() => {
        if (existingExpense) {
            setExpense({
                description: existingExpense.description,
                amount: existingExpense.amount,
            });
        }
    }, [existingExpense]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense((prevExpense) => ({
            ...prevExpense,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentDateTime = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
        };
        if (editIndex !== null) {
            updateExpense({ ...expense, ...currentDateTime });
        } else {
            addExpense({ ...expense, ...currentDateTime });
        }
        setExpense({
            description: '',
            amount: ''
        });
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.innerFormContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formTitle}>
                        {editIndex !== null ? 'Edit Expense' : 'Add Expense'}
                    </div>
                    <div className={styles.cancelBtn}>
                    <button type="button" className={`${styles.button} ${styles.buttonRed}`} onClick={cancelEdit}>
                            Cancel
                        </button>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={expense.description}
                            onChange={handleChange}
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
                            onChange={handleChange}
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
