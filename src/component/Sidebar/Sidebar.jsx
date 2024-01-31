import React from 'react';
import styles from './sidebar.module.css';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <nav className={styles.sidebar}>
      <ul className="list-unstyled">
        <li>
          <Link
            to="/dashboard"
            className={`${styles.listItem} ${location.pathname === "/dashboard" ? styles.activeLink : ""
              }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/all-expenses"
            className={`${styles.listItem} ${location.pathname === "/all-expenses" ? styles.activeLink : ""
              }`}
          >
            All Expenses
          </Link>
        </li>
        <li>
          <Link
            to="/group"
            className={`${styles.listItem} ${location.pathname === "/group" ? styles.activeLink : ""
              }`}
          >
            Groups
          </Link>
        </li>
      </ul>
    </nav>

  );
};

export default Sidebar;
