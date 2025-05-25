import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please Login No Auth Header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decodeValue = jwt.verify(token, process.env.JWT_SEC);
        if (!decodeValue || !decodeValue.user) {
            res.status(401).json({
                message: "Invalid Token",
            });
            return;
        }
        req.user = decodeValue.user;
        next();
    }
    catch (error) {
        console.log("JWT verification error: ", error);
        res.status(401).json({
            message: "Please login - JWT error",
        });
    }
};
