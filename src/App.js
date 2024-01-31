import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Dashboard from './component/Dashboard/Dashboard';
import Index from './component/Home/Home';
import SignIn from './component/SignIn/SignIn';
import SignUp from './component/SignUp/SignUp';
import AddFriend from './component/Add_friends/AddFriend';
import Group from './component/Group/Group';
import AddExpense from './component/Add_expense/AddExpense';
import Expenses from './component/Expenses/Expenses';
import PrivateRoutes from './component/ProtectedRoute'
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './component/AuthContext';

const App = () => {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route path="/dashboard" element={<PrivateRoutes Children={Dashboard} />} />
          <Route path="/add-friends" element={<PrivateRoutes Children={AddFriend} />} />
          <Route path="/group" element={<PrivateRoutes Children={Group} />} />
          <Route path="/add-expense" element={<PrivateRoutes Children={AddExpense} />} />
          <Route path="/all-expenses" element={<PrivateRoutes Children={Expenses} />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App


