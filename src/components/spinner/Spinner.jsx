import React from 'react';
import styles from './Spinner.module.css'; // Adjust path as per your project structure
import { MdRefresh } from 'react-icons/md'; // Example spinner icon

const Spinner = () => {
    return (
        <div className={styles.spinner}>
            <MdRefresh className={styles.icon} />
        </div>
    );
};

export default Spinner;
