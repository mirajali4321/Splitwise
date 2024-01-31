import { getDocs, collection } from 'firebase/firestore';

const processExpenses = (items, loggedInUserName) => {
    const userExpenses = items.filter(expense =>
        expense.users.some(user => user.name === loggedInUserName)
    );

    userExpenses.forEach(expense => {
        expense.users.forEach(user => {
            user.netAmount = user.payment - user.order;
        });

        const usersWhoOwe = expense.users.filter(user => user.netAmount < 0);
        const usersWhoPaidExtra = expense.users.filter(user => user.netAmount > 0);

        usersWhoOwe.sort((a, b) => a.netAmount - b.netAmount);

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
                    amount: amountToSettle
                };
                settlementTransactions.push(settlementTransaction);

                owingUser.netAmount += amountToSettle;
                receivingUser.netAmount -= amountToSettle;

                if (receivingUser.netAmount === 0) {
                    usersWhoPaidExtra.shift();
                }
            }
        }

        expense.settlements = settlementTransactions;
    });

    return userExpenses;
};

const fetchAndProcessExpenses = async (db, loggedInUser, setUserExpenses, setErrorMsg, setIsLoading) => {
    setIsLoading(true);

    try {
        const querySnapshot = await getDocs(collection(db, "expenses"));
        const items = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            settlements: [],
        }));

        const loggedInUserName = loggedInUser.displayName;
        const userExpenses = processExpenses(items, loggedInUserName);

        setUserExpenses(userExpenses);
    } catch (error) {
        setErrorMsg("Failed to fetch data.");
    } finally {
        setIsLoading(false);
    }
};


export default fetchAndProcessExpenses ;