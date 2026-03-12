const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.registerVendor = async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone,
            password,
            confirm_password,
            category_id,
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !phone ||
            !password ||
            !confirm_password ||
            !category_id
        ) {
            return res.status(400).json({
                message: "All required fields must be filled",
            });
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        db.query(
            "SELECT * FROM vendors WHERE email = ?",
            [email],
            async (err, existingVendor) => {
                if (err) {
                    return res.status(500).json({ message: "Database error" });
                }

                if (existingVendor.length > 0) {
                    return res.status(400).json({
                        message: "Vendor already exists",
                    });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = `
          INSERT INTO vendors
          (first_name, last_name, email, phone, password, category_id, status)
          VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
        `;

                db.query(
                    sql,
                    [first_name, last_name, email, phone, hashedPassword, category_id],
                    (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: "Failed to register vendor",
                            });
                        }

                        return res.status(201).json({
                            message: "Vendor registered successfully",
                            vendorId: result.insertId,
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.loginUser = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        db.query(
            "SELECT * FROM admins WHERE email = ?",
            [email],
            async (err, adminResults) => {
                if (err) {
                    return res.status(500).json({ message: "Database error" });
                }

                if (adminResults.length > 0) {
                    const admin = adminResults[0];
                    const isMatch = await bcrypt.compare(password, admin.password);

                    if (!isMatch) {
                        return res.status(401).json({ message: "Invalid password" });
                    }

                    const token = jwt.sign(
                        {
                            id: admin.id,
                            email: admin.email,
                            role: "admin",
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                    );

                    return res.status(200).json({
                        message: "Admin login successful",
                        token,
                        user: {
                            id: admin.id,
                            name: admin.name,
                            email: admin.email,
                            role: "admin",
                        },
                    });
                }

                db.query(
                    "SELECT * FROM vendors WHERE email = ?",
                    [email],
                    async (err, vendorResults) => {
                        if (err) {
                            return res.status(500).json({ message: "Database error" });
                        }

                        if (vendorResults.length === 0) {
                            return res.status(404).json({ message: "User not found" });
                        }

                        const vendor = vendorResults[0];
                        const isMatch = await bcrypt.compare(password, vendor.password);

                        if (!isMatch) {
                            return res.status(401).json({ message: "Invalid password" });
                        }

                        const token = jwt.sign(
                            {
                                id: vendor.id,
                                email: vendor.email,
                                role: "vendor",
                            },
                            process.env.JWT_SECRET,
                            { expiresIn: "1d" }
                        );

                        return res.status(200).json({
                            message: "Vendor login successful",
                            token,
                            user: {
                                id: vendor.id,
                                name: vendor.first_name,
                                email: vendor.email,
                                role: "vendor",
                            },
                        });
                    }
                );
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // check if admin already exists
        db.query(
            "SELECT * FROM admins WHERE email = ?",
            [email],
            async (err, result) => {

                if (err) {
                    return res.status(500).json({ message: "Database error" });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Admin already exists"
                    });
                }

                // hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO admins (name,email,password) VALUES (?,?,?)",
                    [name, email, hashedPassword],
                    (err, result) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                message: "Admin registration failed"
                            });
                        }

                        res.status(201).json({
                            message: "Admin registered successfully",
                            adminId: result.insertId
                        });

                    }
                );

            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};