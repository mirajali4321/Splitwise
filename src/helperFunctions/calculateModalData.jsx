const calculateModalData = (userData, totalBill) => {
    const totalUserOrders = userData.reduce((total, user) => total + parseFloat(user.order), 0);
    const totalUserPayments = userData.reduce((total, user) => total + parseFloat(user.payment), 0);
    const numericTotalBill = parseFloat(totalBill);
  
    let errorMessage = '';
    if (totalUserOrders < 0 || totalUserPayments < 0) {
      errorMessage = 'Orders and payments cannot have negative values.';
    } else if (
      totalUserOrders !== numericTotalBill &&
      totalUserPayments !== numericTotalBill
    ) {
      errorMessage = 'Total amount of orders and payments do not match the total bill amount.';
    } else if (totalUserOrders !== numericTotalBill) {
      errorMessage = 'Total amount of orders does not match the total bill amount.';
    } else if (totalUserPayments !== numericTotalBill) {
      errorMessage = 'Total amount of payments does not match the total bill amount.';
    }
  
    return { totalUserOrders, totalUserPayments, errorMessage };
  };
  
  export default calculateModalData;