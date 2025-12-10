const jwt = require('jsonwebtoken');

const middleware = (req,res,next)=>{
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required",
            });
        }
        
        const token = authHeader.split(' ')[1]?.trim();
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization token format",
            });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured",
            });
        }
        
        const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decryptedToken.userId;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(401).json({
            success: false,
            message: error.message || "Invalid or expired token",
        });
    }
}

module.exports = middleware;