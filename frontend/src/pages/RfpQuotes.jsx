import { useEffect, useState } from "react";
import API from "../api/axios";
import "./RfpQuotes.css";

function RfpQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/quotes");
      setQuotes(res.data || []);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quotes-page">
      <div className="quotes-header-row">
        <h2 className="quotes-main-title">RFP Quotes</h2>
        <div className="quotes-breadcrumb">Home / RFP Quotes</div>
      </div>

      <div className="quotes-card">
        <div className="quotes-card-top">
          <h3>RFP Quotes</h3>
        </div>

        {error && <p className="quotes-error">{error}</p>}

        {loading ? (
          <p>Loading quotes...</p>
        ) : (
          <div className="quotes-table-wrap">
            <table className="quotes-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>RFP No.</th>
                  <th>Item Name</th>
                  <th>Vendor Id</th>
                  <th>Vendor Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {quotes.length > 0 ? (
                  quotes.map((quote, index) => (
                    <tr key={quote.id}>
                      <td>{index + 1}</td>
                      <td>{quote.rfp_id}</td>
                      <td>{quote.item_name}</td>
                      <td>{quote.vendor_id}</td>
                      <td>{quote.vendor_price}</td>
                      <td>{quote.quantity}</td>
                      <td>{quote.total_price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No quotes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="quotes-pagination-box">
          <button type="button" className="quotes-page-btn active-page">
            1
          </button>
        </div>
      </div>
    </div>
  );
}

export default RfpQuotes;