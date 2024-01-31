import Select from '@mui/material/Select';
import Navbar from '../NavBar/Navbar';
import styles from './AddFriend.module.css';
import Loader from '../Loader/Loader';
import Sidebar from '../Sidebar/Sidebar';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import fetchUserData from '../../helperFunctions/fetchUSerData';
import fetchGroupData from '../../helperFunctions/fetchGroupData';

import { db } from '../../firebase';
import { useAuth } from '../AuthContext';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const AddFriend = () => {
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const personName = useState([]);
    const theme = useTheme();
    const history = useNavigate();
    const loggedInUser = useAuth();
    const selectedEmails = [];

    const handleMuiSelectChange = (event) => {
        const selectedEmails = event.target.value;
        const selectedUsers = users.filter(user => selectedEmails.includes(user.email));
        setSelectedUsers(selectedUsers);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const items = await fetchUserData(db);
            setUsers(items);
            setIsLoading(false);
          } catch (error) {
            setErrorMsg("Failed to fetch user data.");
          }
        };
    
        fetchData();
      }, []);

    const fetchGroups = async () => {
    try {
        const groups = await fetchGroupData(db);
        const groupNames = groups.map(group => group.name);
        return groupNames;
    } catch (error) {
        setErrorMsg('Error fetching groups.');
        return [];
    }
};

    const create_group = async e => {
        e.preventDefault();
        // Validations 
        if (!groupName || selectedUsers.length === 0) {
            setErrorMsg("Fill all fields");
            return;
        }

        const cleanGroupName = groupName.trim();
        const existingGroups = await fetchGroups();
        if (existingGroups.includes(cleanGroupName)) {
            setErrorMsg("Group name already exists");
            return;
        }
        if (loggedInUser) {
            const loggedInUserEmail = loggedInUser.email;
            const selectedUserEmails = selectedUsers.map(user => user.email);
            if (selectedUserEmails.includes(loggedInUserEmail)) {
                setErrorMsg("You cannot add yourself to the group");
                return;
            }
        }
        setErrorMsg("");

        if (loggedInUser) {
            selectedEmails.push({
                email: loggedInUser.email,
                name: loggedInUser.displayName
            });
        }

        selectedUsers.forEach(user => {
            selectedEmails.push({
                email: user.email,
                name: user.name
            });
        });

        await addDoc(collection(db, 'groups'), {
            name: groupName,
            selectedUsers: selectedEmails,
        });

        setGroupName("");
        setSelectedUsers([]);
        history('/dashboard');
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
                            <div className={`col-md-3  p-0  ${styles.leftSection}`}>
                                {/* Left Section */}
                                <Sidebar />
                            </div>
                            <div className={`col-md-9 p-0 ${styles.rightSection}`}>
                                {/* Right Section */}
                                <div className={`container p-0 ${styles.group_page}`}>
                                    <div className={`container py-5 px-3 ${styles.formContainer}`}>
                                        <form onSubmit={create_group} className={styles.form}>
                                            <h1>Create a new Group</h1>
                                            <label htmlFor="groupName" className={styles.inputName}>Group Name:</label>
                                            <input
                                                type="text"
                                                id="groupName"
                                                placeholder="Enter your group name "
                                                value={groupName}
                                                onChange={(e) => setGroupName(e.target.value)}
                                            />
                                            <div>
                                                <FormControl className={styles.formControl}>
                                                    <InputLabel id="demo-multiple-name-label" className={styles.label}>
                                                        Select users
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo-multiple-name"
                                                        multiple
                                                        value={selectedUsers.map(user => user.email)}
                                                        onChange={handleMuiSelectChange}
                                                        input={<OutlinedInput label="Add Friends" />}
                                                        className={styles.select}
                                                    >
                                                        {users.map((user) => (
                                                            <MenuItem
                                                                key={user.email}
                                                                value={user.email}
                                                                className={styles.menuItem}
                                                                style={getStyles(user.email, personName, theme)}
                                                            >
                                                                {user.name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <p className={styles.errorMsg}>{errorMsg}</p>
                                            <button type="submit">Create</button>
                                        </form>
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
export default AddFriend;






