import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { comparePassword } from "../utils/comparePassword.js";
import { generateToken } from "../utils/generateToken.js";

class Auth {
  static async handleLogin(req, res) {
    try {
   
      const result = validationResult(req);

      if (!result.isEmpty())
        return res.status(400).json({ errors: result.array() });

      const data = matchedData(req);

      const currentUser = await User.findOne({ where: { email: data.email } });
      if (!currentUser) return res.sendStatus(404);

      const isPasswordMatch = await comparePassword(
        data.password,
        currentUser.password
      );

      if (!isPasswordMatch)
        return res.status(400).json({
          errors: [
            {
              path: "password",
              msg: "Incorrect password",
            },
          ],
        });

      const token = generateToken(currentUser);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
        secure: false,
        sameSite: "lax",
      });

      return res
        .status(200)
        .json({ message: "Login successfully", currentUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async handleRegister(req, res) {
    try {
      const result = validationResult(req);

      if (!result.isEmpty())
        return res.status(400).json({ errors: result.array() });

      const data = matchedData(req);

      data.id = uuidv4();
      data.password = await bcrypt.hash(data.password, 10);

      const newCreatedUser = await User.create(data);

      const token = generateToken(newCreatedUser);

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 12,
        secure: false,
        sameSite: "lax",
      });

      return res
        .status(200)
        .json({ message: "Registered successfully", newCreatedUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async handleLogout(req, res) {
    try {
      const { token } = req.cookies;
      if (!token) return res.status(400).json({ message: "No token found" });

      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });

      return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }

  static async handleChangePassword(req, res) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty())
        return res.status(400).json({ errors: result.array() });

      const data = matchedData(req);

      const currentUser = await User.findOne({ where: { id: data.userId } });

      if (!currentUser)
        return res.status(400).json({ message: "No user found" });

      const isPasswordMatch = await comparePassword(
        data.currentPassword,
        currentUser.password
      );

      if (!isPasswordMatch)
        return res.status(400).json({
          errors: [
            {
              path: "currentPassword",
              msg: "Password incorrect",
            },
          ],
        });

      if (data.newPassword !== data.confirmPassword)
        return res.status(400).json({
          errors: [
            {
              path: "newPassword",
              msg: "Password do not match",
            },
          ],
        });

      currentUser.password = await bcrypt.hash(data.newPassword, 10);
      currentUser.save();

      return res.status(200).json({ message: "success" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}

export default Auth;
