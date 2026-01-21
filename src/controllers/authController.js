import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validation/authSchemas.js";

export const register = async (req, res) => {

    try{
        //Removed password validation from controller

        const { name, email, password } = parsed.data;

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
        const token = jwt.sign(
            { userId: user.id },    // userId is included in payload
            process.env.JWT_SECRET, // Token is signed using the JWT_SECRET
            {expiresIn: process.env.JWT_EXPIRES_IN} // expiration is also put in payload
        );

        return res.json({
            token, //Token represents their session
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch(error){
        console.error("Login error:", error);
        res.status(500).json({message: "Server error."});
    }
};
