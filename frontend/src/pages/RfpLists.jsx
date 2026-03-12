import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./RfpLists.css";

function RfpLists() {
  const navigate = useNavigate();

  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfps();
  }, []);

  const fetchRfps = async () => {
    try {
      setLoading(true);
      const res = await API.get("/rfps");
      setRfps(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch RFPs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await API.patch(`/rfps/${id}/status`);
      fetchRfps();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update RFP status");
    }
  };

  return (
    <div className="rfp-page">
      <div className="rfp-header-row">
        <h2 className="rfp-main-title">RFP List</h2>
        <div className="rfp-breadcrumb">Home / RFP List</div>
      </div>

      <div className="rfp-card">
        <div className="rfp-card-top">
          <h3>RFP</h3>
          <button
            type="button"
            className="add-rfp-btn"
            onClick={() => navigate("/admin-dashboard/add-rfp")}
          >
            + Add RFP
          </button>
        </div>

        {error && <p className="rfp-error">{error}</p>}

        {loading ? (
          <p>Loading RFPs...</p>
        ) : (
          <div className="rfp-table-wrap">
            <table className="rfp-table">
              <thead>
                <tr>
                  <th>RFP No.</th>
                  <th>RFP Title</th>
                  <th>RFP Last Date</th>
                  <th>Min Amount</th>
                  <th>Max Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rfps.length > 0 ? (
                  rfps.map((rfp) => (
                    <tr key={rfp.id}>
                      <td>{rfp.id}</td>
                      <td>{rfp.title}</td>
                      <td>{rfp.last_date?.split("T")[0] || rfp.last_date}</td>
                      <td>{rfp.min_amount}</td>
                      <td>{rfp.max_amount}</td>
                      <td>
                        <span
                          className={
                            rfp.status === "OPEN"
                              ? "rfp-status open"
                              : "rfp-status closed"
                          }
                        >
                          {rfp.status}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={
                            rfp.status === "OPEN"
                              ? "rfp-action close"
                              : "rfp-action open"
                          }
                          onClick={() => handleToggleStatus(rfp.id)}
                        >
                          {rfp.status === "OPEN" ? "Close" : "Open"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No RFPs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="rfp-pagination-box">
          <button type="button" className="rfp-page-btn active-page">
            1
          </button>
        </div>
      </div>
    </div>
  );
}

export default RfpLists;