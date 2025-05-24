import User from '../model/User.js';
import jwt from 'jsonwebtoken';
export const loginUser = async (req, res) => {
    try {
        const { email, name, image } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                image,
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
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
export default loginUser;
