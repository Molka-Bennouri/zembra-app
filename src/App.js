import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./navbar/Navbar";
import ListingPage from './listing/ListingPage';
import ProfilePage from "./profile/ProfilePage";
import ManagePayment from './payment/ManagePayment';
import PaymentHistory from './payment/PaymentHistory';
import Login from './login/Login';
import Signup from './login/Signup';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/payment" element={<ManagePayment />} />
        <Route path="/PaymentHistory" element={<PaymentHistory />} />
        <Route path="/login" element={<Login/>} />
         <Route path="/signup" element={<Signup/>} />
      </Routes>
    </Router>
  );
}

export default App;