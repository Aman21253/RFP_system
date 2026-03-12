import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

function CreateRfp() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    item_name: "",
    item_description: "",
    quantity: "",
    last_date: "",
    min_amount: "",
    max_amount: "",
    vendor_ids: [],
  });

  useEffect(() => {
    loadCreateData();
  }, [categoryId]);

  const loadCreateData = async () => {
    try {
      const res = await API.get(`/rfps/create-data/${categoryId}`);
      setCategory(res.data.category);
      setVendors(res.data.vendors);
    } catch (err) {
      console.log(err);
      alert("Failed to load page data");
    }
  };

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name === "vendor_ids") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setForm((prev) => ({
        ...prev,
        vendor_ids: selectedValues,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        category_id: Number(categoryId),
        quantity: Number(form.quantity),
        min_amount: Number(form.min_amount),
        max_amount: Number(form.max_amount),
        vendor_ids: form.vendor_ids.map(Number),
      };

      const res = await API.post("/rfps", payload);

      alert(res.data.message);
      navigate("/admin/rfps");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create RFP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>RFP Create</h2>
      <p>
        Selected Category: <strong>{category?.name}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name *</label><br />
          <input
            type="text"
            name="item_name"
            value={form.item_name}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Item Description *</label><br />
          <input
            type="text"
            name="item_description"
            value={form.item_description}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Quantity *</label><br />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Last Date *</label><br />
          <input
            type="date"
            name="last_date"
            value={form.last_date}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Minimum Price *</label><br />
          <input
            type="number"
            name="min_amount"
            value={form.min_amount}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Maximum Price *</label><br />
          <input
            type="number"
            name="max_amount"
            value={form.max_amount}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Vendor *</label><br />
          <select
            name="vendor_ids"
            multiple
            size="6"
            value={form.vendor_ids}
            onChange={handleChange}
          >
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.first_name} {vendor.last_name} - {vendor.email}
                </option>
              ))
            ) : (
              <option disabled>No approved vendors found</option>
            )}
          </select>
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateRfp;