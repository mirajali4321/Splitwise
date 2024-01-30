# Splitwise React App
Welcome to the Splitwise React App!

## Description
The Splitwise React App is designed to simplify expense management among groups. Users can create expenses, specify details such as the bill amount, participants, and their individual shares. The app then calculates the balance and generates a report to determine who owes how much to whom.

## Features

### User Authentication
- Existing users can log in to the app.
- Firebase is used to manage user authentication.

### Create Expenses
- Users can create expenses with various details, including description, total bill amount, image of the receipt, and expense date.

### Expense Details
- Users can add participants to an expense, indicating how much each person owes or paid.
- The app calculates the shares and balances based on the input data.

### Expense Report
- The app generates a report showing who owes how much to others within the expense group.

## Technologies Used
- React
- React Router
- Firebase (for user authentication and data storage)
- Material-UI and Bootstrap (for UI components)
- FontAwesome (for icons)

## Installation
1. Clone this repository to your local machine.
2. Navigate to the project directory: `cd splitwise-react-app`.
3. Install dependencies: `npm install`.
4. Configure Firebase:
   - Create a Firebase project.
   - Update `.env` with your Firebase configuration.
5. Start the development server: `npm start`.

## Usage
1. Log in using your credentials.
2. Create a new expense, specifying the participants and their shares.
3. View the calculated balances and the expense report.

## Future Enhancements
- Implement the payment settlement module.
- Enhance the UI/UX for a more intuitive user experience.
- Allow users to edit or delete expenses.
- Provide more detailed reports and statistics.

## Contact Information
For any questions or feedback, please contact:
- Name:Muhammad Miraj Ali (miraj.intern@devsinc.com)
- Project Repository:https://github.com/MirajAli468/Splitwise/tree/master

