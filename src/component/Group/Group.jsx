import React from 'react';
import Navbar from '../NavBar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Group.module.css';
import Loader from '../Loader/Loader';
import fetchGroupData from '../../helperFunctions/fetchGroupData';

import { db } from '../../firebase';
import { Link } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [show, setShow] = useState(false);
    const [delShow, setDelShow] = useState(false);
    const [selectedGroupData, setSelectedGroupData] = useState(null);
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
          try {
            const items = await fetchGroupData(db);
            setGroups(items);
            setIsLoading(false);
          } catch (error) {
            setErrorMsg("Failed to fetch group data.");
          }
        };
    
        fetchData();
      }, []);

    const handleViewGroup = (group) => {
        setSelectedGroupData(group);
        handleShow();
    };
    const handleDeleteGroup = (group) => {
        setGroupToDelete(group);
        handleDelShow();
    };

    const deleteGroup = async () => {
        if (groupToDelete) {
            try {
                await deleteDoc(doc(db, 'groups', groupToDelete.id));
                handleDelClose();
            } catch (error) {
                setErrorMsg("Error deleting group.")
            }
        }
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleDelShow = () => setDelShow(true);
    const handleDelClose = () => setDelShow(false);

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
                            <div className={`col-md-9 p-4 ${styles.rightSection}`}>
                                {/* Right Section */}
                                <div className={styles.group_bar}>
                                    <h2>Groups</h2>
                                    <Link to="/add-friends">
                                        <button>Create Group</button>
                                    </Link>
                                </div>
                                <p className='text-danger fs-5'>{errorMsg} </p>

                                {/* Modal for view group data  */}
                                <>
                                    <Modal show={show} onHide={handleClose}>
                                        <Modal.Header className={styles.modalHeader} closeButton>
                                            <Modal.Title >Group Data </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {selectedGroupData && (
                                                <div className={styles.groupInfo}>
                                                    <h3>
                                                        Selected Group: <span className={styles.showGroup}>{selectedGroupData.name}</span>
                                                    </h3>
                                                    <table className={styles.userTable}>
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedGroupData.selectedUsers.map((user, index) => (
                                                                <tr key={index}>
                                                                    <td className="text-capitalize">{user.name}</td>
                                                                    <td>{user.email}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
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
                                {/* Modal for deleting selected group  */}
                                <>
                                    <Modal show={delShow} onHide={handleClose}>
                                        <Modal.Header className={styles.modalHeader} closeButton>
                                            <Modal.Title>Delete Group</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {groupToDelete && (
                                                <p className='fs-4'>Are you sure you want to delete the group  "<span className='text-capitalize text-danger'>{groupToDelete.name}</span>" ?</p>
                                            )}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="danger" onClick={() => deleteGroup(groupToDelete)}>Delete</Button>
                                            <Button variant="secondary" onClick={handleDelClose}>Cancel</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                                {/* table section  */}
                                <div>
                                    <table className={styles.groupTable}>
                                        <thead>
                                            <tr>
                                                <th>Group Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groups.map((group, index) => (
                                                <tr key={index}>
                                                    <td>{group.name}</td>
                                                    <td>
                                                        <button onClick={() => handleViewGroup(group)}>View</button>
                                                        <button className={styles.delete} onClick={() => handleDeleteGroup(group)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Group
