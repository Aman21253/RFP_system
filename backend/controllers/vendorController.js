const db = require("../config/db");

exports.getAllVendors = (req, res) => {
  try {
    const sql = `
      SELECT 
        id,
        first_name,
        last_name,
        email,
        phone,
        status,
        category_id,
        created_at
      FROM vendors
      ORDER BY id DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to fetch vendors",
        });
      }

      return res.status(200).json(results);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.updateVendorStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["APPROVED", "REJECTED", "PENDING"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    db.query(
      "SELECT * FROM vendors WHERE id = ?",
      [id],
      (err, vendorResults) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Database error",
          });
        }

        if (vendorResults.length === 0) {
          return res.status(404).json({
            message: "Vendor not found",
          });
        }

        db.query(
          "UPDATE vendors SET status = ? WHERE id = ?",
          [status, id],
          (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "Failed to update vendor status",
              });
            }

            return res.status(200).json({
              message: `Vendor ${status.toLowerCase()} successfully`,
            });
          }
        );
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};