import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Vendor.css";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await API.get("/vendors");
      setVendors(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/vendors/${id}/status`, { status });
      fetchVendors();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update vendor status");
    }
  };

  return (
    <div className="vendors-page">
      <div className="vendors-header-row">
        <h2 className="vendors-main-title">Vendors List</h2>
        <div className="vendors-breadcrumb">Home / Vendors</div>
      </div>

      <div className="vendors-card">
        <div className="vendors-card-top">
          <h3>Vendors</h3>
        </div>

        {error && <p className="vendor-error-text">{error}</p>}

        {loading ? (
          <p>Loading vendors...</p>
        ) : (
          <div className="vendors-table-wrap">
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>First name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Contact No</th>
                  <th>Vendor Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((vendor, index) => (
                    <tr key={vendor.id}>
                      <td>{index + 1}</td>
                      <td>{vendor.first_name}</td>
                      <td>{vendor.last_name}</td>
                      <td>{vendor.email}</td>
                      <td>{vendor.phone}</td>
                      <td>
                        <span
                          className={
                            vendor.status === "APPROVED"
                              ? "vendor-status approved"
                              : vendor.status === "REJECTED"
                              ? "vendor-status rejected"
                              : "vendor-status pending"
                          }
                        >
                          {vendor.status}
                        </span>
                      </td>
                      <td>
                        <div className="vendor-actions-wrap">
                          {vendor.status !== "APPROVED" && (
                            <button
                              className="vendor-action approve"
                              onClick={() =>
                                handleStatusChange(vendor.id, "APPROVED")
                              }
                            >
                              Approve
                            </button>
                          )}

                          {vendor.status !== "REJECTED" && (
                            <button
                              className="vendor-action reject"
                              onClick={() =>
                                handleStatusChange(vendor.id, "REJECTED")
                              }
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No vendors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="vendors-pagination-box">
          <button className="vendors-page-btn active-page">1</button>
        </div>
      </div>
    </div>
  );
}

export default Vendors;