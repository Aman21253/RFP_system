import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import VendorRegister from "./pages/VendorRegister";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import Vendors from "./pages/Vendor";
import RfpLists from "./pages/RfpLists";
import RfpQuotes from "./pages/RfpQuotes";
import Categories from "./pages/Categories";
import AddRfp from "./pages/AddRfp";
import VendorLayout from "./components/VendorLayout";
import VendorDashboard from "./pages/VenodeDashboard";
import VendorRfpList from "./pages/VendorRfpList";
import ApplyQuote from "./pages/ApplyQuote";
import VendorQuotes from "./pages/VendorQuote";
import AiAssistant from "./pages/AiAssistant";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<VendorRegister />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="rfp-lists" element={<RfpLists />} />
          <Route path="rfp-quotes" element={<RfpQuotes />} />
          <Route path="categories" element={<Categories />} />
          <Route path="add-rfp" element={<AddRfp />} />
          <Route path="ai-assistant" element={<AiAssistant />} />
        </Route>
        <Route
          path="/vendor-dashboard"
          element={
            <ProtectedRoute allowedRole="vendor">
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="rfp-for-quotes" element={<VendorRfpList />} />
          <Route path="apply-quote/:rfpId" element={<ApplyQuote />} />
          <Route path="my-quotes" element={<VendorQuotes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;