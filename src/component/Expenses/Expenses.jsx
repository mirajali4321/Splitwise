import styles from './Expense.module.css';
import Navbar from '../NavBar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Loader from '../Loader/Loader';
import fetchAndProcessExpenses from '../../helperFunctions/fetchExpense';
import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const Expenses = () => {
    const [userExpenses, setUserExpenses] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const loggedInUser = useAuth();

    useEffect(() => {
        if (loggedInUser) {
            fetchAndProcessExpenses(db, loggedInUser, setUserExpenses, setErrorMsg, setIsLoading);
        }
    }, [loggedInUser]);

    const handleClose = () => {
        setShow(false);
    };
    const handleShow = (expense) => {
        setSelectedExpense(expense);
        setShow(true);
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
                            <div className={`col-md-9  py-4 ${styles.rightSection}`}>
                                {/* Heading  */}
                                <div className={styles.dash_bar}>
                                    {loggedInUser && (
                                        < div className={styles.Expense_bar}>
                                            <h2>Expense Overview for <span className='text-capitalize'>{loggedInUser.displayName}</span></h2>
                                        </div>
                                    )}
                                </div>
                                {errorMsg && (
                                    <p className='text-danger fs-5'>{errorMsg.message}</p>
                                )}

                                {/* display expenses  */}
                                <div className={styles.expenseList}>
                                    <h3>Your Expenses</h3>
                                    <table className={styles.expenseTable}>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Description</th>
                                                <th>Total Bill</th>
                                                <th>View Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userExpenses.map(expense => (
                                                <tr key={expense.id}>
                                                    <td>{expense.date}</td>
                                                    <td className='text-capitalize'>{expense.description}</td>
                                                    <td>{expense.totalBill}</td>
                                                    <td>
                                                        <button
                                                            className={styles.viewButton}
                                                            onClick={() => handleShow(expense)}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <>
                                        <Modal show={show} onHide={handleClose}>
                                            <Modal.Header className={styles.modalHeader} closeButton>
                                                <Modal.Title className={styles.Title}>Expense Report</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <h2 className='mb-3'>Expense Spliting</h2>
                                                {selectedExpense && (
                                                    <div>
                                                        {selectedExpense.users.map((user, index) => (
                                                            <p key={index} className='fs-5'>
                                                                <span className='text-capitalize text-primary'>{user.name} </span>
                                                                have made a purchase for <span className='text-success '>{user.order}$ </span>
                                                                and made a payment of <span className='text-danger '>{user.payment}$</span>.
                                                            </p>
                                                        ))}

                                                        <div className={styles.settlements}>
                                                            <h2>Settlement Transactions</h2>
                                                            <ul>
                                                                {selectedExpense.settlements.length > 0 ? (
                                                                    selectedExpense.settlements.map((settlement, index) => (
                                                                        <li key={index} className='fs-5'>
                                                                            <span className='text-primary'>{settlement.from}</span>{" "}
                                                                            owes{" "}
                                                                            <span className='text-danger'>{settlement.amount}$</span>{" "}
                                                                            <span className={styles.units}>units</span>{" "}
                                                                            to{" "}
                                                                            <span className='text-primary'>{settlement.to}</span>
                                                                        </li>
                                                                    ))
                                                                ) : (
                                                                    <p className='fs-5'>No settlement transactions available for this expense.</p>
                                                                )}
                                                            </ul>
                                                        </div>

                                                        <div >
                                                            {
                                                                selectedExpense.image && (
                                                                    <>
                                                                        <h2>Expense Receipt </h2>
                                                                        <div className={styles.displayImage}>
                                                                            <img src={selectedExpense.image} alt="Expense_Image" />
                                                                        </div>
                                                                    </>
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                )}
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default Expenses
