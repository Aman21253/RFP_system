const db = require("../config/db");

exports.getCategories = (req, res) => {
    try {
        const sql = "SELECT * FROM categories ORDER BY id DESC";

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: "Failed to fetch categories",
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

exports.addCategory = (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Category name is required",
            });
        }

        db.query(
            "SELECT * FROM categories WHERE name = ?",
            [name.trim()],
            (err, existing) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database error",
                    });
                }

                if (existing.length > 0) {
                    return res.status(400).json({
                        message: "Category already exists",
                    });
                }

                const sql = "INSERT INTO categories (name, status) VALUES (?, 'ACTIVE')";

                db.query(sql, [name.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            message: "Failed to add category",
                        });
                    }

                    return res.status(201).json({
                        message: "Category added successfully",
                        categoryId: result.insertId,
                    });
                });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};

exports.toggleCategoryStatus = (req, res) => {
    try {
        const { id } = req.params;

        db.query(
            "SELECT * FROM categories WHERE id = ?",
            [id],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: "Database error",
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        message: "Category not found",
                    });
                }

                const currentStatus = results[0].status;
                const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

                db.query(
                    "UPDATE categories SET status = ? WHERE id = ?",
                    [newStatus, id],
                    (err) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: "Failed to update category status",
                            });
                        }

                        return res.status(200).json({
                            message: `Category ${newStatus.toLowerCase()} successfully`,
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