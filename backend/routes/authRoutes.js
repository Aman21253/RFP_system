const express = require("express");
const router = express.Router();
const {
    registerVendor,
    loginUser,
    registerAdmin
} = require("../controllers/authControllers");

router.post("/vendor-register", registerVendor);
router.post("/login", loginUser);
router.post("/admin-register", registerAdmin);

module.exports = router;