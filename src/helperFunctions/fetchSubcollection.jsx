import { doc, getDocs, collection } from 'firebase/firestore';

const fetchSubcollectionData = async (db, userExpenses, setSubcollectionSettlements, setIsLoading, setErrorMsg) => {
    setIsLoading(true);
  
    try {
      const subcollectionData = [];
  
      for (const expense of userExpenses) {
        const expenseRef = doc(db, 'expenses', expense.id);
        const settlementsRef = collection(expenseRef, 'settlements');
        const querySnapshot = await getDocs(settlementsRef);
  
        querySnapshot.forEach(doc => {
          const settlementData = doc.data();
          settlementData.settlementId = doc.id;
          subcollectionData.push(settlementData);
        });
      }
      setSubcollectionSettlements(subcollectionData);
    } catch (error) {
      setErrorMsg("Error fetching settlement data.");
    } finally {
      setIsLoading(false);
    }
  };
  
  export default fetchSubcollectionData;