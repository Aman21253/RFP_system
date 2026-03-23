const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { testDbConnection } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const rfpRoutes = require("./routes/rfpRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const vendorQuoteRoutes = require("./routes/vendorQuoteRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.send("API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/rfps", rfpRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/vendor", vendorQuoteRoutes);
app.use("/api/ai", aiRoutes);

// error handler must be last
app.use((err, req, res, next) => {
    console.error("Server error stack:", err.stack || err);
    console.error("Server error message:", err.message);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await testDbConnection();
});