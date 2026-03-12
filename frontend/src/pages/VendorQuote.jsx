import { useEffect, useState } from "react";
import API from "../api/axios";

function VendorQuotes() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await API.get(`/vendor/my-quotes/${user.id}`);
      setQuotes(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "18px" }}>
        <h2>My Quotes</h2>
        <div>Home / My Quotes</div>
      </div>

      <div style={{ background: "white", padding: "18px", borderRadius: "8px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#22313c", color: "white" }}>
              <th style={{ padding: "12px" }}>Sr. No.</th>
              <th style={{ padding: "12px" }}>Item Name</th>
              <th style={{ padding: "12px" }}>Vendor Price</th>
              <th style={{ padding: "12px" }}>Quantity</th>
              <th style={{ padding: "12px" }}>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <tr key={quote.id}>
                  <td style={{ padding: "12px" }}>{index + 1}</td>
                  <td style={{ padding: "12px" }}>{quote.title}</td>
                  <td style={{ padding: "12px" }}>{quote.amount}</td>
                  <td style={{ padding: "12px" }}>{quote.quantity}</td>
                  <td style={{ padding: "12px" }}>{quote.total_price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                  No quotes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendorQuotes;