const db = require("../config/db");

exports.getAllQuotes = (req, res) => {
    const sql = `
    SELECT
      quotes.id,
      quotes.rfp_id,
      quotes.vendor_id,
      quotes.amount AS vendor_price,
      rfps.title AS item_name,
      rfps.quantity,
      (quotes.amount * rfps.quantity) AS total_price,
      quotes.submitted_at
    FROM quotes
    INNER JOIN rfps ON quotes.rfp_id = rfps.id
    ORDER BY quotes.id DESC
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch quotes" });
        }

        return res.status(200).json(results);
    });
};