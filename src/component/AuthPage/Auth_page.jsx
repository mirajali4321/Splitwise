import React from 'react';
import styles from './Auth.module.css';

const Auth_page = () => {
    return (
        <>
            <div className={`col-md-6 text-dark ${styles.leftSection}`}>
                <div className='mb-5'>
                    <div className={styles.auth_logo}>
                        <img src="/images/splitwiselogo.png" alt="splitwise_logo" />
                    </div>
                </div>
                <h1>Let us help you managing your expenses with Splitwise.</h1>
                <p>Our registration process is quick and easy, taking no more than a minute to complete.</p>
                <div className={styles.commentImg}>
                    <img src="/Images/comment .png" alt="commentImg" />
                </div>
            </div>
        </>
    )
}

export default Auth_page;
