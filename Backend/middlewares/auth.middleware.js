import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controllers/user.controller.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body?.accessToken;
        if (!token) {
            return res.status(403).json({
                message: "JWT_ACCESS_TOKEN_NOT_FOUND",
                status: 403,
                success: false,
            });
        }

        // check is token is correct
        // keep it outside the try and catch block as it is required later on outside the try and catch block and keep it let instea of const
        let decoded = null;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Synchronous call
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({
                    error: err,
                    message: "JWT_ACCESS_TOKEN_EXPIRY",
                    status: 403,
                    success: false,
                });
            } else if (err.name === "JsonWebTokenError") {
                return res.status(403).json({
                    error: err,
                    message: "JWT_ACCESS_TOKEN_INVALID",
                    status: 403,
                    success: false,
                });
            }
        }

        // Find the user associated with the token
        const user = await User.findById(decoded._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            return res.status(403).json({
                message: "JWT_ACCESS_TOKEN_INVALID",
                status: 403,
                success: false,
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return res.status(403).json({
            message: "GENERAL_ERROR",
            status: 403,
            success: false,
            error: error.message,
        });
    }
};

export const optionalVerifyJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "") ||
            req.body?.accessToken;
        if (!token) {
            req.user = null;
            return next();
        }
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded?._id).select("-password -refreshToken");
            req.user = user || null;
        } catch (err) {
            req.user = null;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};





