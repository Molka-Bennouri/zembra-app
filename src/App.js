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
import ModalCard from "./payment/ModalCard";
import QueryHistory from './listing/QueryHistory';

import SSOCallback from "./login/SSOCallback";
import ForgotPassword from "./login/ForgotPassword";
import ResetPassword from "./login/ResetPassword";
import LandingPage from "./landingpage/LandingPage";
import Dashboard from "./dashboard/Dashboard";
import AddNetworkForm from "./admin/networks/AddNetworkForm";
import AddFieldForm from "./admin/fields/AddFieldForm";
import NetworkList from "./admin/networks/NetworkList";
import AdminDashboard from "./dashboard/AdminDashboard";
import FieldList from "./admin/fields/FieldList";
import ClientList from "./admin/clients/ClientList";
import PlansList from "./admin/plans/PlansList";
import AddPlanForm from "./admin/plans/AddPlanForm";
import EditClientPage from "./admin/clients/EditClientPage";
import AddClientPage from "./admin/clients/AddClientPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* No navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/auth/callback" element={<SSOCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* With navbar */}
        <Route element={<><Navbar /><Outlet /></>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/listing" element={<ListingPage />} />
          <Route path="/reviews" element={<ReviewPage />} />
          <Route path="/match" element={<MatchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<ManagePayment />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/modalcard" element={<ModalCard />} />
          <Route path="/scrapinghistory" element={<QueryHistory />} />

          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/AddNetworkForm" element={<AddNetworkForm />} />
          <Route path="/AddFieldForm" element={<AddFieldForm />} />
          <Route path="/AddPlanForm" element={<AddPlanForm />} />
          <Route path="/NetworkList" element={<NetworkList />} />
          <Route path="/FieldList" element={<FieldList />} />
          <Route path="/ClientList" element={<ClientList />} />
          <Route path="/PlansList" element={<PlansList />} />
          <Route path="/admin/clients/create"    element={<AddClientPage />} />
          <Route path="/admin/clients/:id/edit" element={<EditClientPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;