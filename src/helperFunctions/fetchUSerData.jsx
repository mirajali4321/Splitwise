import { collection, getDocs } from 'firebase/firestore';

const fetchUserData = async (db) => {
  try {
    const getUsersData = await getDocs(collection(db, "users"));
    const items = getUsersData.docs.map((doc) => doc.data());
    return items;
  } catch (error) {
    throw new Error("Failed to fetch user data.");
  }
};

export default fetchUserData;