import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function ApplyQuote() {
  const { rfpId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rfp, setRfp] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    remarks: "",
  });

  useEffect(() => {
    fetchRfp();
  }, []);

  const fetchRfp = async () => {
    try {
      const res = await API.get(`/vendor/single-rfp/${user.id}/${rfpId}`);
      setRfp(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/vendor/submit-quote", {
        vendor_id: user.id,
        rfp_id: rfpId,
        amount: form.amount,
        remarks: form.remarks,
      });

      alert("Quote submitted successfully");
      navigate("/vendor-dashboard/rfp-for-quotes");
    } catch (err) {
      console.log(err);
      alert("Failed to submit quote");
    }
  };

  return (
    <div>
      <h2>RFP Create</h2>

      <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Vendor Price *</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              style={{ display: "block", width: "100%", padding: "10px", marginTop: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label>Item Description *</label>
            <input
              type="text"
              value={rfp?.item_description || ""}
              disabled
              style={{ display: "block", width: "100%", padding: "10px", marginTop: "8px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Quantity *</label>
              <input
                type="text"
                value={rfp?.quantity || ""}
                disabled
                style={{ display: "block", width: "100%", padding: "10px", marginTop: "8px" }}
              />
            </div>

            <div>
              <label>Remarks</label>
              <input
                type="text"
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                style={{ display: "block", width: "100%", padding: "10px", marginTop: "8px" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "18px" }}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyQuote;