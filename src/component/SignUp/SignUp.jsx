import Authpage from '../AuthPage/Auth_page';
import Navbar from '../NavBar/Navbar';
import styles from './SignUp.module.css';
import AuthForm from '../AuthForm/authform';
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuth } from '../AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const SignUp = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useAuth();
  const history = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Fill all fields");
      return;
    }
    // Validate Name
    if (!name.match(/^[a-zA-Z\s]*$/)) {
      setErrorMsg("Name can only contain letters and spaces.");
      return;
    }

    // Validate Email
    if (!/^[a-zA-Z0-9._%+-]+@[A-Za-z]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErrorMsg("Invalid email format.");
      return;
    }
    // Validate unique user 
    const db = getFirestore();
    const usersRef = collection(db, "users");
    const emailQuery = query(usersRef, where("email", "==", email));
    const emailQuerySnapshot = await getDocs(emailQuery);

    if (!emailQuerySnapshot.empty) {
      setErrorMsg("Email address is already registered.");
      return;
    }

    // Validate Password
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMsg("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrorMsg("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/\d/.test(password)) {
      setErrorMsg("Password must contain at least one number.");
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setErrorMsg("Password must contain at least one special character.");
      return;
    }

    setErrorMsg("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const db = getFirestore();
      await addDoc(collection(db, "users"), {
        name: name,
        email: email,
        password: password,
      });

      await updateProfile(user, {
        displayName: name,
      });
      history('/dashboard');
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }
  else {
    return (
      <>
        <Navbar />
        <div className={`container-fluid  `}>
          <div className={`row ${styles.loginRow}`}>
            <Authpage />
            <div className={`col-md-6 ${styles.rightSection}`}>
              <div className={` ${styles.formContainer}`}>
                <AuthForm
                  type="signup"
                  handleSubmit={signUp}
                  errorMsg={errorMsg}
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};



export default SignUp;

