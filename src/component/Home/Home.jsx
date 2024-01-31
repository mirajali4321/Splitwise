import React from 'react';
import Navbar from '../NavBar/Navbar';
import styles from './Home.module.css';
import Loader from '../Loader/Loader';
import { auth } from '../../firebase';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Index = () => {
  const user = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <Loader />
    );
  }
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  else {
    return (
      <>
        <div>
          <Navbar />
        </div>
        <div className={`container-fluid ${styles.container}`}>
          <div className={`row ${styles.row}`}>
            <div className={`col-md-4 p-5 ${styles.leftSection}`}>
              {/* Left section  */}
              <div className={styles.mbl_img}>
                <img src="/Images/mbl.png" alt="Mobile_image" />
              </div>
            </div>
            <div className={`col-md-8 p-5 ${styles.rightSection}`}>
              {/* Right Section Content */}
              <h1>Splitting expenses has never been easier.</h1>
              <div className={styles.feature}>
                <span className={styles.iconCircle}>
                  <FontAwesomeIcon icon={faCheckCircle} className={`${styles.icon}`} />
                </span>
                <p>Share bills and IOUs.</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.iconCircle} >
                  <FontAwesomeIcon icon={faCheckCircle} className={`${styles.icon}`} />
                </span>
                <p>Make sure everyone gets paid back.</p>
              </div>
              <div className={styles.feature}>
                <span className={styles.iconCircle}>
                  <FontAwesomeIcon icon={faCheckCircle} className={`${styles.icon}`} />
                </span>
                <p>Simplify expense tracking with Splitwise.</p>
              </div>
              <Link to="/login">
                <button>Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Index;
