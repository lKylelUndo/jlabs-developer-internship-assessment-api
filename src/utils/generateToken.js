import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  try {
    return jwt.sign({ user }, process.env.TOKEN || "access-token-key", {
      expiresIn: "1d",
    });
  } catch (error) {
    console.log(error);
  }
};
