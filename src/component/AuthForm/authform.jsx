import React from 'react';
import { Link } from 'react-router-dom';
import styles from './auth.module.css';

const AuthForm = ({ type, handleSubmit, errorMsg, name, setName, email, setEmail, password, setPassword }) => {
  return (
    <div className={styles.rightSection}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h1>{type === 'signup' ? 'Create your account now' : 'Login to your account'}</h1>
          {type === 'signup' && (
            <div className={styles.inputlabel}>
              <label htmlFor="name" className={styles.inputName}>Name:</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className={styles.inputlabel}>
            <label htmlFor="email" className={styles.inputName}>Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputlabel}>
            <label htmlFor="password" className={styles.inputName}>Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
          <button type="submit">{type === 'signup' ? 'Register' : 'Login'}</button>
          <p className={styles.inputName}>
            {type === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span className={styles.link}>
              <Link to={type === 'signup' ? '/login' : '/signup'}>
                {type === 'signup' ? 'Login' : 'SignUp'}
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
