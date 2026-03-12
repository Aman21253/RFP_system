const express = require("express");
const router = express.Router();
const { getAllQuotes } = require("../controllers/quoteController");

router.get("/", getAllQuotes);

module.exports = router;