import Navbar from '../NavBar/Navbar'
import styles from "./SignIn.module.css"
import Loader from '../Loader/Loader'
import AuthForm from '../AuthForm/authform';
import React, { useState, useEffect } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { useAuth } from '../AuthContext';

const SignIn = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuth();
  const history = useNavigate();

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
  const signIn = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        history('/dashboard');
      })
      .catch((error) => {
        setErrorMsg('Invalid email or password');
      })
  }
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  else {
    return (
      <>
        <Navbar />
        <div className={`container-fluid p-4  ${styles.loginPage}`}>
          <div className={`align-items-center justify-content-center ${styles.loginRow}`}>
            <div className={`container p-5 ${styles.formContainer}`}>
              <AuthForm
                type="login"
                handleSubmit={signIn}
                errorMsg={errorMsg}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default SignIn

