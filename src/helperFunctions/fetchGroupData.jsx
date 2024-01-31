import { collection, getDocs } from 'firebase/firestore'; 

const fetchGroupData = async (db) => {
  try {
    const getGroupData = await getDocs(collection(db, "groups"));
    const items = getGroupData.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return items;
  } catch (error) {
    throw new Error("Failed to fetch group data.");
  }
};

export default fetchGroupData;
