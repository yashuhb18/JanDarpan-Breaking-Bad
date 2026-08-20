import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            // Email validation pattern: matches a standard email format
            match: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phoneNumber: {
            type: String,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER",
            required: true,
        },

        refreshToken: {
            type: String, // The refresh token itself
            default: null,
        },

        // array of strings
        interests: {
            type: [String],
        },

        incomeGroup: {
            type: String,
            enum: ['EWS', 'General', 'OBC', 'SC', 'ST'],

        },

        state: {
            type: String,
        },

        age: {
            type: Number,
        },

        favorites: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Scheme',
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },

    },

    { timestamps: true }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});


// Compare password with hashed password
userSchema.methods.isPasswordCorrect = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};


// Generate access token
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            // username: this.username,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};


// Generate refresh token
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", userSchema);

export default User;