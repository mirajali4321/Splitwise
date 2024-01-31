import Navbar from '../NavBar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Dashboard.module.css';
import Loader from '../Loader/Loader'
import fetchAndProcessUserExpenses from '../../helperFunctions/dashboardExpense';
import processSettlementsAndSubcollections from '../../helperFunctions/processSettlements';
import fetchSubcollectionData from '../../helperFunctions/fetchSubcollection';

import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState, useEffect } from 'react';
import { collection } from 'firebase/firestore';
import { doc, deleteDoc } from 'firebase/firestore';

const Dashboard = () => {
  const [userExpenses, setUserExpenses] = useState([]);
  const [subcollectionSettlements, setSubcollectionSettlements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const loggedInUser = useAuth();

  useEffect(() => {
    fetchAndProcessUserExpenses(db, loggedInUser, setUserExpenses, setErrorMsg, setIsLoading);
}, [loggedInUser]);

useEffect(() => {
  if (userExpenses.length > 0) {
    processSettlementsAndSubcollections(db, userExpenses, setUserExpenses, setIsLoading);
  } else {
    setIsLoading(false);
  }
}, [userExpenses]);

useEffect(() => {
  fetchSubcollectionData(db, userExpenses, setSubcollectionSettlements, setIsLoading, setErrorMsg);
  setIsLoading(false);
}, [userExpenses]);

  const handleSettle = async (expenseId, settlementId) => {
    try {
      const updatedSubcollectionData = subcollectionSettlements.filter(
        settlement => settlement.settlementId !== settlementId
      );

      const expenseRef = doc(db, 'expenses', expenseId);
      const settlementsRef = collection(expenseRef, 'settlements');
      await deleteDoc(doc(settlementsRef, settlementId));

      setSubcollectionSettlements(updatedSubcollectionData);
    } catch (error) {
      setErrorMsg("Error settling the debt");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <div className={`container-fluid ${styles.container}`}>
            <div className={`row ${styles.row}`}>
              {/* Left Section */}
              <div className={`col-md-3  p-0 ${styles.leftSection}`}>
                <Sidebar />
              </div>
              {/* Right Section */}
              <div className={`col-md-9  p-4 ${styles.rightSection}`}>
                {/* Heading  */}
                <div className={styles.dash_bar}>
                  <h2>Dashboard</h2>
                  <Link to="/add-expense">
                    <button >Add an expense</button>
                  </Link>
                </div>
                <p className='text-danger fs-5'>{errorMsg} </p>

                {/* display expenses  */}
                <div className={styles.settlements}>
                  <h3 className='mb-3'>Settlement Transactions</h3>
                  <div className={styles.twoColumns}>
                    <div className={styles.column}>
                      <div className={`mb-3 ${styles.heading}`}><h4>Owe Statements</h4></div>
                      {subcollectionSettlements.some(
                        settlement =>
                          settlement.from === loggedInUser.displayName
                      ) ? (
                        <ul className={styles.transactionList}>
                          {subcollectionSettlements.map((settlement, index) => (
                            settlement.from === loggedInUser.displayName && (
                              <div key={index}>
                                <li className={` fs-5 ${styles.transactionItem} ${styles.transactionWithButton}`}>
                                  {`You owe ${settlement.amount} units to ${settlement.to}`}
                                  <button onClick={() => {
                                    handleSettle(settlement.expenseId, settlement.settlementId);
                                  }}>Settle</button>
                                </li>
                              </div>
                            )
                          ))}
                        </ul>
                      ) : (
                        <p className='fs-5'>No owe statements involving you.</p>
                      )}
                    </div>
                    <div className={styles.column} >
                      <div className={`mb-3 ${styles.heading}`} ><h4>Lent Statements</h4></div>
                      {subcollectionSettlements.some(
                        settlement =>
                          settlement.to === loggedInUser.displayName
                      ) ? (
                        <ul className={styles.transactionList}>
                          {subcollectionSettlements.map((settlement, index) => (
                            settlement.to === loggedInUser.displayName && (
                              <li key={index} className={` fs-5 ${styles.transactionItem}`}>
                                {`You lent ${settlement.amount} units to ${settlement.from}`}
                              </li>
                            )
                          ))}
                        </ul>
                      ) : (
                        <p className='fs-5'>No lent statements involving you.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       )} 
    </>
  )
}
export default Dashboard
