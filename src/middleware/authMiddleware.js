import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {

    // Get auth header
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        // Returning a response, stops execution (next())
        return res.status(401).json({message: "Authorization token required."});
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach User info to request
        req.user = {
            userId: decoded.userId
        };

        // Continue to next middleware / controller
        next();

    } catch(error){
        if (error.name === "TokenExpiredError"){
            return res.status(401).json({message: "Token expired."});
        }

        return res.status(401).json({message: "Invalid token."});
    }
};