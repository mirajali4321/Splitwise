import { doc, addDoc, updateDoc, collection } from 'firebase/firestore';

const processSettlementsAndSubcollections = async (
    db,
    userExpenses,
    setUserExpenses,
    setIsLoading
  ) => {
    setIsLoading(true);
    const updatedExpenses = [];
  
    for (const expense of userExpenses) {
      if (!expense.subcollectionAdded) {
        const usersWhoOwe = expense.users.filter(user => user.netAmount < 0);
        const usersWhoPaidExtra = expense.users.filter(user => user.netAmount > 0);
  
        usersWhoOwe.sort((a, b) => a.netAmount - b.netAmount);
        usersWhoPaidExtra.sort((a, b) => a.netAmount - b.netAmount);
  
        const settlementTransactions = [];
  
        for (const owingUser of usersWhoOwe) {
          while (owingUser.netAmount < 0 && usersWhoPaidExtra.length > 0) {
            const receivingUser = usersWhoPaidExtra[0];
            const amountToSettle = Math.min(
              Math.abs(owingUser.netAmount),
              receivingUser.netAmount
            );
  
            const settlementTransaction = {
              from: owingUser.name,
              to: receivingUser.name,
              amount: amountToSettle,
            };
            settlementTransactions.push(settlementTransaction);
  
            owingUser.netAmount += amountToSettle;
            receivingUser.netAmount -= amountToSettle;
  
            if (receivingUser.netAmount === 0) {
              usersWhoPaidExtra.shift();
            }
          }
        }
  
        const expenseRef = doc(db, "expenses", expense.id);
        const settlementsRef = collection(expenseRef, "settlements");
  
        for (const settlement of settlementTransactions) {
          const addedSettlement = {
            ...settlement,
            expenseId: expense.id,
          };
  
          await addDoc(settlementsRef, addedSettlement);
        }
        await updateDoc(expenseRef, { subcollectionAdded: true });
  
        updatedExpenses.push({ ...expense, subcollectionAdded: true });
      } else {
        updatedExpenses.push(expense);
      }
    }
  
    setUserExpenses(updatedExpenses);
    setIsLoading(false);
  };
  
  export default processSettlementsAndSubcollections;