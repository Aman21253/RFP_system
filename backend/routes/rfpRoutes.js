const express = require("express");
const router = express.Router();

const {
    getAllRfps,
    getRfpCategories,
    getCreateRfpData,
    addRfp,
    toggleRfpStatus,
} = require("../controllers/rfpController");

router.get("/", getAllRfps);

// for select category page
router.get("/categories", getRfpCategories);

// for create rfp page after category selection
router.get("/create-data/:category_id", getCreateRfpData);

// create rfp + assign vendors
router.post("/", addRfp);

router.patch("/:id/status", toggleRfpStatus);

module.exports = router;