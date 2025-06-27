import {Router} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model";
import {Role} from "../models/role.model";

const router = Router();

interface PayloadLogin {
    email: string;
    password: string;
}

interface PayloadRegister {
    full_name: string;
    email: string;
    password: string;
}

router.post(
    "/register",
    async (
        req: {
            body: PayloadRegister;
        },
        res: any
    ) => {
        try {
            const {full_name, email, password} = req.body;

            const existingUser = await User.findOne({email});
            if (existingUser)
                return res.status(400).json({message: "Email already in use"});

            // Tìm role "User"
            const userRole = await Role.findOne({code: "user", is_deleted: false});
            if (!userRole)
                return res.status(500).json({message: "User role not found"});

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user with role
            await User.create({
                full_name,
                email,
                password: hashedPassword,
                role_id: userRole._id,
            });

            return res.status(201).json({
                message: "User registered successfully",
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({message: "Server error"});
        }
    }
);

router.post(
    "/login",
    async (
        req: {
            body: PayloadLogin;
        },
        res: any
    ) => {
        try {
            const {email, password} = req.body;

            const user = await User.findOne({email}).populate("role_id");

            if (!user)
                return res.status(401).json({message: "Account does not exist"});

            if (typeof user.password !== "string") {
                return res.status(500).json({message: "Invalid password format"});
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res
                    .status(401)
                    .json({message: "Incorrect account information"});

            const token = jwt.sign(
                {userId: user._id},
                process.env.JWT_SECRET as string,
                {expiresIn: "10d"}
            );

            const dataResponse = {
                user,
                accessToken: token,
            };

            return res.status(200).json({
                message: "Login successful",
                data: dataResponse,
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({message: "Server error"});
        }
    }
);

export default router;
