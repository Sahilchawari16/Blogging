import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import TryCatch from "../utils/TryCatch.js";
import getBuffer from '../utils/dataUri.js';
import { v2 as cloudinary } from 'cloudinary';
import { Oauth2Client } from '../utils/GoogleConfig.js';
import axios from 'axios';
export const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({
            message: "Authorization Code Provided",
        });
        return;
    }
    const googleRes = await Oauth2Client.getToken(code);
    Oauth2Client.setCredentials(googleRes.tokens);
    const userres = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    const { email, name, picture } = userres.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.status(200).json({
        message: "Login Sucess",
        token,
        user,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({
            message: "No User With This Id",
        });
        return;
    }
    res.json(user);
});
export const updateUser = TryCatch(async (req, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, {
        name,
        instagram,
        facebook,
        linkedin,
        bio
    }, {
        new: true,
    });
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.json({
        message: "User Updated",
        token,
        user,
    });
});
export const updateProfilePic = TryCatch(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No File To Upload"
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(400).json({
            message: "Failed TO Generate Buffer"
        });
        return;
    }
    const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs",
    });
    const user = await User.findByIdAndUpdate(req.user?._id, {
        image: cloud.secure_url
    }, {
        new: true
    });
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d",
    });
    res.json({
        message: "User Profile Pic Updated",
        token,
        user,
    });
});
