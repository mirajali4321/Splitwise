import { getDocs, collection } from 'firebase/firestore';

const fetchAndProcessUserExpenses = async (db, loggedInUser, setUserExpenses, setErrorMsg, setIsLoading) => {
    setIsLoading(true);

    if (loggedInUser) {
        try {
            const querySnapshot = await getDocs(collection(db, "expenses"));
            const items = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const loggedInUserName = loggedInUser.displayName;
            const userExpenses = items.filter(expense =>
                expense.users.some(user => user.name === loggedInUserName)
            );

            userExpenses.forEach(expense => {
                expense.users.forEach(user => {
                    user.netAmount = user.payment - user.order;
                });
            });

            setUserExpenses(userExpenses);
        } catch (error) {
            setErrorMsg("Failed to fetch data.");
        } finally {
            setIsLoading(false);
        }
    }
};

export default fetchAndProcessUserExpenses;