import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Navbar from '../NavBar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import styles from './AddExpense.module.css'
import Loader from '../Loader/Loader';
import fetchGroupData from '../../helperFunctions/fetchGroupData';
import uploadImage from '../../helperFunctions/uploadImage';
import calculateModalData from '../../helperFunctions/calculateModalData';

import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom'
import { Button, Form, Modal } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';

const AddExpense = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [modaleErrorMsg, setMoadlErrorMsg] = useState("");
  const [groups, setGroup] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [date, setDate] = useState('');
  const dateInputRef = useRef(null);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [submittedUserData, setSubmittedUserData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [description, setDescription] = useState('');
  const [totalBill, setTotalBill] = useState('');
  const [selectedGroupData, setSelectedGroupData] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await fetchGroupData(db);
        setGroup(items);
        setIsLoading(false);
      } catch (error) {
        setErrorMsg("Failed to fetch group data.");
      }
    };

    fetchData();
  }, []);

  // handle selected group
  const handleGroupChange = async (event) => {

    const selectedId = event.target.value;
    setSelectedGroupId(selectedId);
    try {
      const groupDocRef = doc(db, "groups", selectedId);
      const groupDocSnapshot = await getDoc(groupDocRef);

      if (groupDocSnapshot.exists()) {
        const groupData = groupDocSnapshot.data();
        setSelectedGroupData(groupData);
      }
    } catch (error) {
      setErrorMsg("Failed to get selected group data.")
    }
  };
  const handleDateChange = (e) => { setDate(e.target.value); }

  // handel input feilds of modal 
  const handleInputChange = (index, field, value) => {
    const updatedData = [...submittedUserData];
    if (!updatedData[index]) {
      updatedData[index] = {};
    }
    updatedData[index][field] = value;
    updatedData[index]['name'] = selectedGroupData.selectedUsers[index].name;
    setSubmittedUserData(updatedData);
  };

  // Handel user data in modal 
  const handleGetUsersDataSubmit = (e) => {
    e.preventDefault();
    const { errorMessage } = calculateModalData(
      submittedUserData,
      totalBill
    );
    if (errorMessage) {
      setMoadlErrorMsg(errorMessage);
    } else {
      setMoadlErrorMsg("");
      setUsers(submittedUserData);
      setFormSubmitted(true);
      handleClose();
    }
  };

  // create an expense collection 
  const createExpense = async (e) => {
    e.preventDefault();

    if (!selectedGroupId || !description || !totalBill || !date || users.length === 0) {
      setErrorMsg("Please fill in all fields");
      return;
    }
    try {
      const expensesCollectionRef = collection(db, 'expenses');
      const imageDownloadUrl = await uploadImage(imageFile, setErrorMsg);
      await addDoc(expensesCollectionRef, {
        groupId: selectedGroupId,
        description: description,
        totalBill: parseFloat(totalBill) || 0,
        date: date,
        subcollectionAdded: false,
        users: submittedUserData.map(user => ({
          name: user.name,
          order: parseFloat(user.order) || 0,
          payment: parseFloat(user.payment) || 0
        })),
        image: imageDownloadUrl,
      });
    } catch (error) {
      setErrorMsg('An error occurred while adding the expense.');
    }
    history('/dashboard');
  };

  const handleImageChange = (file) => {
    setImageFile(file);
  };

  const handleClose = () => { setShow(false); };
  const handleShow = () => setShow(true);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Navbar />
          <div className={`container-fluid ${styles.container}`}>
            <div className={`row ${styles.row}`}>
              <div className={`col-md-3  p-0 ${styles.leftSection}`}>
                {/* Left Section */}
                <Sidebar />
              </div>
              <div className={`col-md-9  p-4 ${styles.rightSection}`}>
                {/* Right Section */}
                <div className={`container  ${styles.formContainer}`}>
                  <form onSubmit={createExpense} className={styles.form}>
                    <h1>Add an expense</h1>
                    <div className={`mb-3 ${styles.box}`}>
                      <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">Select Group </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            className='text-capitalize'
                            value={selectedGroupId}
                            label="Select Group"
                            onChange={handleGroupChange}
                          >
                            {groups.map((group) => (
                              <MenuItem key={group.id} value={group.id}>
                                {group.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                    <label htmlFor="description" className={styles.inputName}>Description:</label>
                    <input
                      type="text"
                      id="description"
                      placeholder="Enter a description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <label htmlFor="total_bill" className={styles.inputName}>Total bill:</label>
                    <input
                      type="text"
                      placeholder="Enter total amount "
                      value={totalBill}
                      onChange={(e) => setTotalBill(e.target.value)}
                    />
                    <div >
                      <label htmlFor="date" className={` ${styles.inputName}`}>Date:</label>
                      <input
                        id="date"
                        type="date"
                        onChange={handleDateChange}
                        ref={dateInputRef}
                        className={`mx-2 ${styles.inputDate}`}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      <button className={styles.splitButton} onClick={handleShow}>Split your bill</button>
                    </div>
                    <input
                      type="file"
                      accept=".png, .jpeg, .jpg"
                      onChange={(e) => handleImageChange(e.target.files[0])}
                    />
                    {formSubmitted && (
                      <div className={styles.savedData}>
                        <h2>Splitting data of group menbers:</h2>
                        <ul>
                          {submittedUserData.map((user, index) => (
                            <li key={index} className={styles.userDataItem}>
                              <div className={styles.userData}>
                                <span className={`text-capitalize ${styles.userName}`}>{user.name}:</span>
                                <span className={styles.userDetails}>
                                  {user.order > 0 || user.payment > 0 ? (
                                    <span className={styles.paySize}>
                                      {user.order > 0 && (
                                        <>
                                          You've made a purchase for{' '}
                                          <span className={styles.ordercolor}>{user.order}$</span>
                                        </>
                                      )}
                                      {(user.order > 0 && user.payment > 0) ||
                                        (user.order === 0 && user.payment > 0) ? (
                                        ' and '
                                      ) : null}
                                      {user.payment > 0 && (
                                        <>
                                          {user.order === 0 ? (
                                            <>
                                              You've made a purchase for{' '}
                                              <span className={styles.ordercolor}>0$</span>
                                            </>
                                          ) : null}
                                          {user.order > 0 ? (
                                            <>
                                              settled the payment by paying{' '}
                                              <span className={styles.payColor}>{user.payment}$</span>.
                                            </>
                                          ) : (
                                            <>
                                              You've settled the payment by paying{' '}
                                              <span className={styles.payColor}>{user.payment}$</span>.
                                            </>
                                          )}
                                        </>
                                      )}
                                    </span>
                                  ) : (
                                    <span className={styles.paySize}>No activity.</span>
                                  )}
                                </span>
                              </div>
                            </li>
                          ))}

                        </ul>
                      </div>
                    )}

                    {/* Modal for spliting expenses */}
                    <>
                      <Modal className={styles.Modal} show={show} onHide={handleClose}>
                        <Modal.Header className={styles.modalHeader} closeButton>
                          <Modal.Title>Split by adjustment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {selectedGroupData ? (
                            <div >
                              <h3>Selected Group: <span className={styles.displayName}>{selectedGroupData.name}</span></h3>

                              {/* Display the user-splitting section */}
                              <Form onSubmit={handleGetUsersDataSubmit}>
                                <table className={styles.groupTable}>
                                  <thead>
                                    <tr >
                                      <th > Name</th>
                                      <th>Order Amount</th>
                                      <th>Payment Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedGroupData.selectedUsers.map((user, index) => (
                                      <tr key={index}>
                                        <td className='text-capitalize'>{user.name}</td>
                                        <td>
                                          <Form.Control
                                            type="number"
                                            value={submittedUserData[index]?.order || ''}
                                            onChange={(e) => handleInputChange(index, 'order', e.target.value)}
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="number"
                                            value={submittedUserData[index]?.payment || ''}
                                            onChange={(e) => handleInputChange(index, 'payment', e.target.value)}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </Form>
                              <p className={styles.errorMsg}>{modaleErrorMsg}</p>
                            </div>
                          ) : (
                            <p>Please select a group to continue.</p>
                          )}
                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="primary" type="submit" onClick={handleGetUsersDataSubmit}>
                            Save Changes
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                    <p className={`fs-5 mb-4 ${styles.errorMsg}`}>{errorMsg}</p>
                    <button type="submit">Create </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default AddExpense
