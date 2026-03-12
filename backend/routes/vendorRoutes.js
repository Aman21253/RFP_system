const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
    getAllVendors,
    updateVendorStatus,
} = require("../controllers/vendorController");

router.get("/", getAllVendors);
router.patch("/:id/status", updateVendorStatus);
router.get("/by-category/:category_id", (req, res) => {
    const { category_id } = req.params;

    const sql = `
    SELECT id, first_name, last_name
    FROM vendors
    WHERE category_id = ? AND status = 'APPROVED'
  `;

    db.query(sql, [category_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error fetching vendors" });
        }

        res.json(result);
    });
});

module.exports = router;