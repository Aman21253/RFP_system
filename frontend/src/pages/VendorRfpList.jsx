import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./VendorRfpList.css";

function VendorRfpList() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRfps();
  }, []);

  const fetchRfps = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/vendor/assigned-rfps/${user.id}`);
      setRfps(res.data || []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to fetch RFP list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-rfp-page">
      <div className="vendor-rfp-header-row">
        <h2 className="vendor-rfp-main-title">RFP List</h2>
        <div className="vendor-rfp-breadcrumb">Home / RFP List</div>
      </div>

      <div className="vendor-rfp-card">
        <div className="vendor-rfp-card-top">
          <h3>RFP</h3>
        </div>

        {error && <p className="vendor-rfp-error">{error}</p>}

        {loading ? (
          <p>Loading RFPs...</p>
        ) : (
          <div className="vendor-rfp-table-wrap">
            <table className="vendor-rfp-table">
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
                              ? "vendor-rfp-status open"
                              : "vendor-rfp-status closed"
                          }
                        >
                          {rfp.status}
                        </span>
                      </td>
                      <td>
                        {rfp.quote_id ? (
                          <button
                            type="button"
                            className="vendor-rfp-action applied"
                            disabled
                          >
                            Applied
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="vendor-rfp-action apply"
                            onClick={() =>
                              navigate(`/vendor-dashboard/apply-quote/${rfp.id}`)
                            }
                          >
                            Apply
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No RFP found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="vendor-rfp-pagination-box">
          <button type="button" className="vendor-rfp-page-btn active-page">
            1
          </button>
        </div>
      </div>
    </div>
  );
}

export default VendorRfpList;