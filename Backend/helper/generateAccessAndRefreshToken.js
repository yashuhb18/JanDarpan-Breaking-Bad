import User from "../models/user.model.js";


export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const newRefreshToken = await user.generateRefreshToken();

        // Save the refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, newRefreshToken };
    } catch (error) {
        console.error("Error generating access and refresh tokens:", error);
        throw new Error("Internal server error");
    }
};
