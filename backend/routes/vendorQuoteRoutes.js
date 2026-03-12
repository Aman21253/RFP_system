const express = require("express");
const router = express.Router();
const {
    getVendorAssignedRfps,
    getSingleRfpForVendor,
    submitQuote,
    getVendorQuotes,
} = require("../controllers/vendorQuoteController");

router.get("/assigned-rfps/:vendorId", getVendorAssignedRfps);
router.get("/single-rfp/:vendorId/:rfpId", getSingleRfpForVendor);
router.post("/submit-quote", submitQuote);
router.get("/my-quotes/:vendorId", getVendorQuotes);

module.exports = router;