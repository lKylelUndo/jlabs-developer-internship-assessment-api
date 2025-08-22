import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(400).json({ message: "Token not found" });

    jwt.verify(
      token,
      process.env.TOKEN || "access-token-key",
      (error, decoded) => {
        if (error) return res.status(401).json({ error });

        req.currentUser = decoded;
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
};
