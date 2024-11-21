import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt; 

        if(!token){
            return res.status(401).json({error: "Not authorized, no token"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        if(!decoded){
            return res.status(401).json({error: "Not authorized, token invalid"}); 
        }

        const user = await User.findById(decoded.userId).select("-password"); 

        if(!user){
            return res.status(404).json({error: "Not authorized, no user found"}); 
        }

        if (!user.isVerified) {
            return res.status(403).json({ error: "Email not verified" }); 
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Not authorized, internal server error" }); 
    }
}