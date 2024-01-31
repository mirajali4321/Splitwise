import styles from './NavBar.module.css';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuth } from '../AuthContext'; 

const Navbar = () => {
  const history = useNavigate();
  const authUser = useAuth();

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        history('/');
      })
    }

  return (
    <nav className={`navbar navbar-expand-lg p-2 ${styles.NavBar}`}>
      <div className={`container-fluid px-5 ${styles['navbar-container']}`}>
        <div className={`navbar-brand p-0 ${styles.logo}`}>
          <Link to="/dashboard" className="d-flex align-items-center gap-2">
            <div className={styles.logo_img}>
              <img src="/Images/logo.png"alt="Splitwise logo" />
            </div>
            <h1>SPLITWISE</h1>
          </Link>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        ><span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${styles['auth-buttons']}`} id="navbarNav">
          {authUser !== null ? ( 
            authUser.displayName !== null ? ( 
              <>
                <p className={`text-white ${styles.username}`}>{authUser.displayName}</p>
                <button className={styles.register} onClick={userSignOut}>Sign Out</button>
              </>
            ) : (
              <div className={styles.loader}></div>  
            )
          ) : (
            <div className="d-flex">
              <button className={styles.login}>
                <Link to="/login">Login</Link>
              </button>
              <button className={styles.register}>
                <Link to="/SignUp">Register</Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

