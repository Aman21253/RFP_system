import { Outlet, Link } from "react-router-dom";
import "./VendorLayout.css";

function VendorLayout() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="vendor-layout">
      <aside className="vendor-sidebar">
        <div className="vendor-logo">Velocity</div>

        <nav className="vendor-nav">
          <Link to="/vendor-dashboard">Dashboard</Link>
          <Link to="/vendor-dashboard/rfp-for-quotes">RFP For Quotes</Link>
          <Link to="/vendor-dashboard/my-quotes">My Quotes</Link>
        </nav>
      </aside>

      <div className="vendor-main">
        <header className="vendor-topbar">
          <span>Welcome {user?.name}</span>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="logout-btn"
          >
            Logout
          </button>
        </header>

        <div className="vendor-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default VendorLayout;