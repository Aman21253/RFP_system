const express = require("express");
const router = express.Router();

const {
    getCategories,
    addCategory,
    toggleCategoryStatus,
} = require("../controllers/categoryController");

router.get("/", getCategories);
router.post("/", addCategory);
router.patch("/:id/status", toggleCategoryStatus);

module.exports = router;