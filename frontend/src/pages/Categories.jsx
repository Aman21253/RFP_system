import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setPageLoading(true);
      const res = await API.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch categories");
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError("");

    if (!newCategory.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/categories", {
        name: newCategory,
      });

      setNewCategory("");
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await API.patch(`/categories/${id}/status`);
      fetchCategories();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-header-row">
        <h2 className="categories-main-title">Categories</h2>
        <div className="categories-breadcrumb">Home / Categories</div>
      </div>

      <div className="categories-card">
        <div className="categories-card-top">
          <h3>Categories</h3>
          <button className="add-category-btn" onClick={() => setShowModal(true)}>
            + Add Category
          </button>
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        {pageLoading ? (
          <p>Loading categories...</p>
        ) : (
          <div className="categories-table-wrap">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>Categories name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <tr key={cat.id}>
                      <td>{index + 1}</td>
                      <td>{cat.name}</td>
                      <td>
                        <span
                          className={
                            cat.status === "ACTIVE"
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {cat.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className={
                            cat.status === "ACTIVE"
                              ? "action-btn deactivate"
                              : "action-btn activate"
                          }
                          onClick={() => handleToggleStatus(cat.id)}
                        >
                          {cat.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination-box">
          <button className="page-btn active-page">1</button>
        </div>
      </div>

      {showModal && (
        <div className="category-modal-overlay">
          <div className="category-modal">
            <h3>Add Category</h3>

            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;