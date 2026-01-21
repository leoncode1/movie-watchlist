import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validation/authSchemas.js";

export const register = async (req, res) => {

    try{
        //Removed password validation from controller

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({message: "User already exists."});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in DB
        const user = await prisma.user.create({
            data: {
                name, 
                email, 
                password: hashedPassword,
            }
        });

        // Respond (Never send password)
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (error){
        console.error("Register Error:", error);
        res.status(500).json({message: "Server error."});
    }
}

// Login Controller Function
// Uses 'export', so routes can use it.
export const login = async (req, res) => {

    try{
        // Sets the request body of the input provided to 'email' and 'password'.
        const { email, password } = req.body;

        //Removed validation input for email/password

        // Queries DB using the email provided.
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // 401 = Authentication Failure
        // User NOT found.
        if (!user){
            return res.status(401).json({message: "Invalid credentials."});
        }

        // password      = plain text from request
        // user.password = HASHED password from DB
        // password is hashed and compared, then T/F is returned.
        // ONLY compare hashes, NEVER decrypt passwords. 
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(401).json({message: "Invalid credentials."});
        }

        //If User logs in successfully, token is created...
        const accessToken = jwt.sign(
            { userId: user.id },    // userId is included in payload
            process.env.JWT_SECRET, // Token is signed using the JWT_SECRET
            {expiresIn: process.env.JWT_EXPIRES_IN} // expiration is also put in payload
        );

        // Refresh Token
        const refreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        );

        // Stores refresh token in DB
        await prisma.user.update({
            where: {id: user.id},
            data: {refreshToken},
        });

        return res.json({
            accessToken, //Token represents their session
            refreshToken,
            // user: {
            //     id: user.id,
            //     name: user.name,
            //     email: user.email,
            // },
        });

    } catch(error){
        console.error("Login error:", error);
        res.status(500).json({message: "Server error."});
    }
};

export const refresh = async (req, res) => {

    try{

        const { refreshToken } = req.body;

        if(!refreshToken){
            return res.status(401).json({message: "Refresh token expired."});
        }

        const payload = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await prisma.user.findUnique({
            where: {id: payload.userId},
        });

        if (!user || user.refreshToken !== refreshToken){
            return res.status(403).json({message: "Invalid refresh token."});
        }

        //Rotate refresh token
        const newAccessToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        const newRefreshToken = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        await prisma.user.update({
            where: {id: user.id},
            data: {refreshToken: newRefreshToken},
        });

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });

    }catch(error){
        console.error("Refresh token error:", error);
        res.status(403).json({message: "Invalid or expired refresh token."});
    }
}

export const logout = async (req, res) => {
    await prisma.user.update({
        where: {id: req.user.userId},
        data: {refreshToken: null},
    });

    res.status(204).send();
};
