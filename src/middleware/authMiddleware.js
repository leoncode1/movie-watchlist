import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {

    try{
        // Get auth header
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            // Returning a response, stops execution (next())
            return res.status(401).json({message: "Not authorized."});
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach User info to request
        req.user = {
            userId: decoded.userId
        };

        // Continue to next middleware / controller
        next();
    } catch(error){
        console.error("Auth middleware error:", error);
        return res.status(500).json({message: "Invalid or expired token."});
    }
};