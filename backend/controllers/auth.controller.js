import { UserModel } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import { genTokenAndSetCookie } from "../utils/genTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  resetSuccessEmail,
} from "../mailtrap/emails.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "all fields required" });
    }
    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "user already exists" });
    }
    const hashedPass = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = await UserModel.create({
      email,
      password: hashedPass,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24 hours
    });
    await user.save();
    // jwt
    genTokenAndSetCookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "user Created Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await UserModel.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expired verification code",
      });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(201).json({
      success: true,
      message: "user verified Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });

    genTokenAndSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();
    res.status(201).json({
      success: true,
      message: "Logged in Successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error:", error);

    res.status(400).json({ success: false, message: "invalid credentials" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(201).json({ success: true, message: "succesfully logged out" });
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    // generate reset token

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      success: true,
      message: "password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgot Password ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "invalid or expired reset token" });
    // update password
    const hashedPass = await bcryptjs.hash(password, 10);

    user.password = hashedPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await resetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset succesfully" });
  } catch (error) {
    console.log("Error in reset Password ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
export const checkAuth = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
