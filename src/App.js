import { BrowserRouter as Router, Routes, Route, Outlet  } from "react-router-dom";
import './App.css';
import Login from './login/Login';
import Signup from './login/Signup'
import Navbar from "./navbar/Navbar";
import ListingPage from './listing/ListingPage';
import ProfilePage from "./profile/ProfilePage";
import ManagePayment from './payment/ManagePayment';
import PaymentHistory from './payment/PaymentHistory';
import Invoices from './payment/Invoices';
import ReviewPage from "./listing/ReviewPage";
import MatchPage from "./listing/MatchPage";
import ModalCard from "./payment/ModalCard";

function App() {
  return (
    <Router>
      <Routes>
        {/* No navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* With navbar */}
        <Route element={<><Navbar /><Outlet /></>}>
          <Route path="/listing" element={<ListingPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<ManagePayment />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/modalcard" element={<ModalCard />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;