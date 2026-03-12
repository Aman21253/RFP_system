const db = require("../config/db");

exports.getVendorAssignedRfps = (req, res) => {
    const vendorId = req.params.vendorId;

    const sql = `
    SELECT 
      rfps.id,
      rfps.title,
      rfps.last_date,
      rfps.min_amount,
      rfps.max_amount,
      rfps.status,
      quotes.id AS quote_id
    FROM rfp_vendors
    INNER JOIN rfps 
      ON rfp_vendors.rfp_id = rfps.id
    LEFT JOIN quotes 
      ON quotes.rfp_id = rfps.id 
      AND quotes.vendor_id = rfp_vendors.vendor_id
    WHERE rfp_vendors.vendor_id = ?
    ORDER BY rfps.id DESC
  `;

    db.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch vendor RFPs" });
        }

        return res.status(200).json(results);
    });
};

exports.getSingleRfpForVendor = (req, res) => {
    const { vendorId, rfpId } = req.params;

    const sql = `
    SELECT rfps.*
    FROM rfp_vendors
    INNER JOIN rfps ON rfp_vendors.rfp_id = rfps.id
    WHERE rfp_vendors.vendor_id = ? AND rfps.id = ?
    LIMIT 1
  `;

    db.query(sql, [vendorId, rfpId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch RFP" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "RFP not found" });
        }

        return res.status(200).json(results[0]);
    });
};

exports.submitQuote = (req, res) => {
    const { vendor_id, rfp_id, amount, remarks } = req.body;

    if (!vendor_id || !rfp_id || !amount) {
        return res.status(400).json({ message: "All required fields are required" });
    }

    const checkSql = `
    SELECT id 
    FROM quotes 
    WHERE vendor_id = ? AND rfp_id = ?
    LIMIT 1
  `;

    db.query(checkSql, [vendor_id, rfp_id], (checkErr, checkRows) => {
        if (checkErr) {
            console.log(checkErr);
            return res.status(500).json({ message: "Failed to check existing quote" });
        }

        if (checkRows.length > 0) {
            return res.status(400).json({ message: "Quote already submitted" });
        }

        const sql = `
      INSERT INTO quotes (rfp_id, vendor_id, amount, remarks)
      VALUES (?, ?, ?, ?)
    `;

        db.query(sql, [rfp_id, vendor_id, amount, remarks || ""], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to submit quote" });
            }

            return res.status(201).json({
                message: "Quote submitted successfully",
                quoteId: result.insertId,
            });
        });
    });
};

exports.getVendorQuotes = (req, res) => {
    const vendorId = req.params.vendorId;

    const sql = `
    SELECT 
      quotes.id,
      quotes.amount,
      quotes.remarks,
      quotes.submitted_at,
      rfps.title,
      rfps.quantity,
      (quotes.amount * rfps.quantity) AS total_price
    FROM quotes
    INNER JOIN rfps ON quotes.rfp_id = rfps.id
    WHERE quotes.vendor_id = ?
    ORDER BY quotes.id DESC
  `;

    db.query(sql, [vendorId], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch vendor quotes" });
        }

        return res.status(200).json(results);
    });
};