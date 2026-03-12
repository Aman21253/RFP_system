import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./VendorRegister.css";

function VendorRegister() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    revenue: "",
    employees: "",
    gst_no: "",
    pan_no: "",
    phone: "",
    category_id: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCatLoading(true);

      // change endpoint if your categories route is different
      const res = await API.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
      setCategories([]);
    } finally {
      setCatLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const {
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      phone,
      category_id,
    } = form;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !password ||
      !confirm_password ||
      !phone ||
      !category_id
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // only sending fields that your current backend supports
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm_password: form.confirm_password,
        category_id: form.category_id,
      };

      const res = await API.post("/auth/vendor-register", payload);

      setSuccess(res.data.message || "Vendor registered successfully");

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        revenue: "",
        employees: "",
        gst_no: "",
        pan_no: "",
        phone: "",
        category_id: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-register-page">
      <div className="vendor-register-wrapper">
        <div className="vendor-register-card">
          <div className="vendor-register-header">
            <h1>Welcome to RFP System!</h1>
            <p>Register as Vendor</p>
          </div>

          <div className="vendor-register-body">
            {error && <p className="vendor-message error">{error}</p>}
            {success && <p className="vendor-message success">{success}</p>}

            <form onSubmit={handleSubmit}>
              <div className="vendor-grid">
                <div className="form-group">
                  <label>
                    First name<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="Enter Firstname"
                    value={form.first_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Last Name<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="Enter Lastname"
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    Email<span>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Password<span>*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Confirm Password<span>*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    placeholder="Enter Confirm Password"
                    value={form.confirm_password}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Revenue (Last 3 Years in Lacks)<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="revenue"
                    placeholder="Enter Revenue"
                    value={form.revenue}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    No of Employees<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="employees"
                    placeholder="No of Employees"
                    value={form.employees}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    GST No<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="gst_no"
                    placeholder="Enter GST No"
                    value={form.gst_no}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    PAN No<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="pan_no"
                    placeholder="Enter PAN No"
                    value={form.pan_no}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Phone No<span>*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Phone No"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    Categories<span>*</span>
                  </label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option value="">
                      {catLoading ? "Loading..." : "All Categories"}
                    </option>

                    {categories.map((cat) => (
                      <option
                        key={cat.id || cat.category_id}
                        value={cat.id || cat.category_id}
                      >
                        {cat.name || cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="register-btn-wrap">
                <button type="submit" className="register-btn" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </div>
            </form>

            <div className="bottom-login-link">
              Already have an account? <Link to="/">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorRegister;