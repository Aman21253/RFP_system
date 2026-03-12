import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaListAlt,
  FaTable,
  FaCog,
} from "react-icons/fa";
import "../styles/AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">Velocity</div>

        <nav className="admin-nav">
          <NavLink to="/admin-dashboard" className="admin-link">
            <FaTachometerAlt /> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/admin-dashboard/vendors" className="admin-link">
            <FaUsers /> <span>Vendors</span>
          </NavLink>

          <NavLink to="/admin-dashboard/rfp-lists" className="admin-link">
            <FaListAlt /> <span>RFP Lists</span>
          </NavLink>

          <NavLink to="/admin-dashboard/rfp-quotes" className="admin-link">
            <FaTable /> <span>RFP Quotes</span>
          </NavLink>

          <NavLink to="/admin-dashboard/categories" className="admin-link">
            <FaCog /> <span>Categories</span>
          </NavLink>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div></div>
          <div className="admin-top-right">
            <span>Welcome {user?.name || "Admin"}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="admin-breadcrumb">
          <span>Home</span>
        </div>

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <span>2023 © Copyright.</span>
          <span>Support Email: support@velosiot.com</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminLayout;