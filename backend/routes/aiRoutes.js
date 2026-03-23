const express = require("express");
const router = express.Router();
const { askAssistant } = require("../controllers/aiController");

router.get("/test", (req, res) => {
    res.json({ success: true, message: "AI route working" });
});
router.post("/ask", askAssistant);

module.exports = router;