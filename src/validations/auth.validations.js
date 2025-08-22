import { body, param } from "express-validator";
import User from "../models/User.js";

export const loginValidationRules = [
  body("email")
    .escape()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .custom(async (value, { req }) => {
      console.log("Email received for validation:", value);
      const isEmailRegistered = await User.findOne({ where: { email: value } });
      if (!isEmailRegistered) throw new Error("Email is not registered");
      return true;
    }),

  body("password").escape().notEmpty().withMessage("Password is required"),
];

export const registerValidationRules = [
  body("name").notEmpty().withMessage("Name is required").escape(),
  body("email")
    .escape()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide valid email")
    .custom(async (value, { req }) => {
      const findUser = await User.findOne({ where: { email: value } });
      if (findUser) throw new Error("Email is already registered");

      return true;
    }),

  body("password")
    .escape()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 3 })
    .withMessage("Password must contain atleast 3 keys"),

  body("confirmPassword")
    .escape()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (req.body.password !== value) throw new Error("Password do not match");

      return true;
    }),
];

export const changePasswordValidationRules = [
  param("userId").notEmpty().withMessage("User id is required"),
  body("currentPassword")
    .escape()
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .escape()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 3 })
    .withMessage("Password must contain atleast 3 keys"),
  body("confirmPassword")
    .escape()
    .notEmpty()
    .withMessage("Confirm new password is required"),
];
