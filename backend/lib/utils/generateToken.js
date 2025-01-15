import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, //zapobiega atakom XSS (cross-site scripting)
    sameSite: "strict", //zapobiega atakom CSRF (cross-site request forgery)
    secure: process.env.NODE_ENV !== "development",
  });
};
