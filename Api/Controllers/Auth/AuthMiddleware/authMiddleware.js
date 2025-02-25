const jwt = require('jsonwebtoken');
const db = require('../../../config/db');

const authMiddleware = (req, res, next) => {
    console.log("🔹 [authMiddleware] - Checking Authorization Header...");

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("❌ [authMiddleware] - Token Not Found!");
        return res.status(401).json({ message: "Token not Found" });
    }

    const token = authHeader.split(" ")[1];
    console.log("✅ [authMiddleware] - Token Extracted:", token);

    if (!token) {
        console.log("❌ [authMiddleware] - No Token Provided!");
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify Token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log("❌ [authMiddleware] - Token Verification Failed:", err.message);
        return res.status(401).json({ message: 'Token is not valid' });
    }

    console.log("✅ [authMiddleware] - Token Verified! User ID:", decoded.uuid);

    // Fetch User Details from Database
    const query = `
        SELECT 
            u.uuid, u.name, u.email, u.password_hash, u.role_id, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.uuid = ?
    `;

    db.query(query, [decoded.uuid], (err, results) => {
        if (err) {
            console.log("❌ [authMiddleware] - Database Query Error:", err.message);
            return res.status(500).json({ message: "Database Error", error: err.message });
        }

        if (results.length === 0) {
            console.log("❌ [authMiddleware] - No User Found with Provided Token!");
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = {
            uuid: results[0].uuid,
            name: results[0].name,
            email: results[0].email,
            role_id: results[0].role_id,
            role_name: results[0].role_name
        };

        console.log("✅ [authMiddleware] - User Authenticated:", req.user);
        next();
    });
};

module.exports = authMiddleware;


