const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("TEST API HIT");
    res.json({ message: "Backend API is working" });
});

module.exports = router;