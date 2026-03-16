import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './login/Login';
import Signup from './login/Signup'
import Navbar from "./navbar/Navbar";
import ListingPage from './listing/ListingPage';
import ProfilePage from "./profile/ProfilePage";
import ManagePayment from './payment/ManagePayment';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<ManagePayment />} />
        <Route path="/listing" element={<ListingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;