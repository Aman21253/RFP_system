const db = require("../config/db");

// Get all RFPs
exports.getAllRfps = (req, res) => {
    const sql = `
    SELECT 
      rfps.id,
      rfps.title,
      rfps.item_description,
      rfps.quantity,
      rfps.last_date,
      rfps.min_amount,
      rfps.max_amount,
      rfps.status,
      rfps.created_at,
      categories.name AS category_name
    FROM rfps
    LEFT JOIN categories ON rfps.category_id = categories.id
    ORDER BY rfps.id DESC
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch RFPs" });
        }

        return res.status(200).json(results);
    });
};

// Step 1: get active categories for select-category page
exports.getRfpCategories = (req, res) => {
    const sql = `
    SELECT id, name
    FROM categories
    WHERE status = 'ACTIVE'
    ORDER BY name ASC
  `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch categories" });
        }

        return res.status(200).json(results);
    });
};

// Step 2: after category select, load that category + approved vendors
exports.getCreateRfpData = (req, res) => {
    const { category_id } = req.params;

    if (!category_id) {
        return res.status(400).json({ message: "Category id is required" });
    }

    const categorySql = `
    SELECT id, name
    FROM categories
    WHERE id = ? AND status = 'ACTIVE'
    LIMIT 1
  `;

    db.query(categorySql, [category_id], (err, categoryRows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Failed to fetch category" });
        }

        if (categoryRows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        const vendorsSql = `
      SELECT id, first_name, last_name, email
      FROM vendors
      WHERE category_id = ? AND status = 'APPROVED'
      ORDER BY first_name ASC
    `;

        db.query(vendorsSql, [category_id], (vendorErr, vendorRows) => {
            if (vendorErr) {
                console.log(vendorErr);
                return res.status(500).json({ message: "Failed to fetch vendors" });
            }

            return res.status(200).json({
                category: categoryRows[0],
                vendors: vendorRows,
            });
        });
    });
};

// Step 3: create RFP and assign vendors
exports.addRfp = (req, res) => {
    const {
        item_name,
        item_description,
        quantity,
        category_id,
        last_date,
        min_amount,
        max_amount,
        vendor_ids,
    } = req.body;

    if (
        !item_name ||
        !item_description ||
        !quantity ||
        !category_id ||
        !last_date ||
        !min_amount ||
        !max_amount
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const insertSql = `
    INSERT INTO rfps 
    (title, item_description, quantity, category_id, last_date, min_amount, max_amount, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'OPEN')
  `;

    db.query(
        insertSql,
        [
            item_name,
            item_description,
            quantity,
            category_id,
            last_date,
            min_amount,
            max_amount,
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to add RFP" });
            }

            const rfpId = result.insertId;

            const selectedVendorIds = Array.isArray(vendor_ids)
                ? vendor_ids
                : vendor_ids
                    ? [vendor_ids]
                    : [];

            if (selectedVendorIds.length === 0) {
                return res.status(201).json({
                    message: "RFP created successfully",
                    rfpId,
                });
            }

            const values = selectedVendorIds.map((vendorId) => [rfpId, vendorId]);

            db.query(
                "INSERT INTO rfp_vendors (rfp_id, vendor_id) VALUES ?",
                [values],
                (assignErr) => {
                    if (assignErr) {
                        console.log(assignErr);
                        return res.status(500).json({
                            message: "RFP created but vendor assignment failed",
                        });
                    }

                    return res.status(201).json({
                        message: "RFP created and vendors assigned successfully",
                        rfpId,
                    });
                }
            );
        }
    );
};

// Toggle status
exports.toggleRfpStatus = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM rfps WHERE id = ?", [id], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "RFP not found" });
        }

        const currentStatus = results[0].status;
        const newStatus = currentStatus === "OPEN" ? "CLOSED" : "OPEN";

        db.query(
            "UPDATE rfps SET status = ? WHERE id = ?",
            [newStatus, id],
            (updateErr) => {
                if (updateErr) {
                    console.log(updateErr);
                    return res.status(500).json({ message: "Failed to update RFP status" });
                }

                return res.status(200).json({
                    message: `RFP ${newStatus.toLowerCase()} successfully`,
                });
            }
        );
    });
};