import { useEffect, useState } from "react";
import API from "../api/axios";
import "./AddRfp.css";

function AddRfp() {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/rfps/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load categories");
    }
  };

  const loadCreateData = async (categoryId) => {
    try {
      setLoading(true);
      const res = await API.get(`/rfps/create-data/${categoryId}`);
      setVendors(res.data.vendors || []);
      setSelectedCategoryName(res.data.category?.name || "");
      setError("");
      setStep(2);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      setError("Please select a category");
      return;
    }

    loadCreateData(selectedCategory);
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

  const handleSubmitRfp = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        category_id: Number(selectedCategory),
        quantity: Number(form.quantity),
        min_amount: Number(form.min_amount),
        max_amount: Number(form.max_amount),
        vendor_ids: form.vendor_ids.map(Number),
      };

      const res = await API.post("/rfps", payload);

      alert(res.data.message || "RFP created successfully");

      setStep(1);
      setSelectedCategory("");
      setSelectedCategoryName("");
      setVendors([]);
      setForm({
        item_name: "",
        item_description: "",
        quantity: "",
        last_date: "",
        min_amount: "",
        max_amount: "",
        vendor_ids: [],
      });
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create RFP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-rfp-page">
      <div className="add-rfp-header-row">
        <h2 className="add-rfp-main-title">
          {step === 1 ? "Select Category" : "Create RFP"}
        </h2>
        <div className="add-rfp-breadcrumb">
          Home / RFP / {step === 1 ? "Select Category" : "Create"}
        </div>
      </div>

      <div className="add-rfp-card">
        {error && <p className="add-rfp-error">{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleCategorySubmit} className="add-rfp-form">
            <div className="add-rfp-field full-width">
              <label>Category *</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-rfp-actions">
              <button type="submit" className="add-rfp-btn-primary" disabled={loading}>
                {loading ? "Loading..." : "Next"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="selected-category-text">
              Selected Category: <strong>{selectedCategoryName}</strong>
            </p>

            <form onSubmit={handleSubmitRfp} className="add-rfp-form-grid">
              <div className="add-rfp-field">
                <label>Item Name *</label>
                <input
                  type="text"
                  name="item_name"
                  value={form.item_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field">
                <label>Item Description *</label>
                <input
                  type="text"
                  name="item_description"
                  value={form.item_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field">
                <label>Last Date *</label>
                <input
                  type="date"
                  name="last_date"
                  value={form.last_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field">
                <label>Minimum Price *</label>
                <input
                  type="number"
                  name="min_amount"
                  value={form.min_amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field">
                <label>Maximum Price *</label>
                <input
                  type="number"
                  name="max_amount"
                  value={form.max_amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="add-rfp-field full-width">
                <label>Vendors *</label>
                <select
                  name="vendor_ids"
                  value={form.vendor_ids}
                  onChange={handleChange}
                  multiple
                  size="6"
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

              <div className="add-rfp-actions full-width">
                <button
                  type="button"
                  className="add-rfp-btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="add-rfp-btn-primary"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddRfp;