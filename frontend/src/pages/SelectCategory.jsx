import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function SelectCategory() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await API.get("/rfps/categories");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category");
      return;
    }

    navigate(`/admin/rfps/create/${categoryId}`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Select Category</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <br /><br />
        <button type="submit">Next</button>
      </form>
    </div>
  );
}

export default SelectCategory;