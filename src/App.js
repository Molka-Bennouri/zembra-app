import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import './App.css';
import Login from './login/Login';
import Signup from './login/Signup'
import Navbar from "./navbar/Navbar";
import ListingPage from './listing/details/ListingPage';
import ReviewPage from './listing/reviews/ReviewPage';
import MatchPage from './listing/match/MatchPage';
import ProfilePage from "./profile/ProfilePage";
import ManagePayment from './payment/ManagePayment';
import PaymentHistory from './payment/PaymentHistory';
import Invoices from './payment/Invoices';
import ModalCard from "./payment/ModalCard";
import ScrapingHistory from "./listing/ScrapingHistory";
import SSOCallback from "./login/SSOCallback";
import ForgotPassword from "./login/ForgotPassword";
import ResetPassword from "./login/ResetPassword";
import LandingPage from "./landingpage/LandingPage";
function App() {
  return (
    <Router>
      <Routes>
        {/* No navbar */}
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/auth/callback" element={<SSOCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<SSOCallback />} /> {/* 👈 from her */}



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
          <Route path="/scrapinghistory" element={<ScrapingHistory />} /> {/* 👈 yours */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;