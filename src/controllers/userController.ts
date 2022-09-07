import User from "../models/user";
import { v4 as uuid } from "uuid";
import { genSalt, hash, compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { createEmailToken } from "../utils/createEmailToken";
import { sendEmail } from "../utils/mailer";
import { Error } from "mongoose";

interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

interface SignInRequest extends Request {
  body: {
    email: string;
    papsword: string;
  };
}

interface ActivateRequest extends Request {
  query: {
    email: string;
    token: string;
  };
}

// @route POST /api/user/signup
// @access public
export const signUp = async (
  req: SignUpRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    res.status(400);
    return next(new Error("All fields are required"));
  } else if (password !== confirmPassword) {
    res.status(400);
    return next(new Error("Password does not match"));
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400);
      return next(new Error("User already exists"));
    } else {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      const userId = uuid();
      const newUser = await User.create({
        userId,
        emailToken: createEmailToken(32),
        emailTokenExp: Date.now() + 30 * 60 * 1000, //sets 30 mins expiration time
        email,
        password: hashedPassword,
      });
      await sendEmail(
        email,
        "Account Activation",
        `<b>Activation code:</b> ${newUser.emailToken}`
      );
      res.status(200).json({
        error: false,
        message: "Activation created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return next(new Error("Unknown error occurred"));
  }
};

// @route POST /api/user/signin
// @access public
export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("All fields are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    const correctPassword = await compare(password, user.password);
    if (correctPassword) {
      res.status(200).json({
        error: false,
        message: "Login success",
      });
    } else {
      res.status(400);
      return next(new Error("Incorrect password"));
    }
  } catch (err) {
    console.log(err);
    return next(new Error("Unknown error occurred"));
  }
};

// @route PATCH /api/user/activate
// @access public
export const activate = async (
  req: ActivateRequest,
  res: Response,
  next: NextFunction
) => {
  const { email, token } = req.query;
  console.log(email);
  if (!email || !token) {
    res.status(400);
    return next(new Error("All fields are required"));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("User not found"));
    }
    if (user.emailTokenExp.getMilliseconds() > Date.now()) {
      res.status(400);
      return next(new Error("Token Expired"));
    }
    if (user.emailToken !== token) {
      res.status(400);
      return next(new Error("Incorrect token"));
    }
    if (user.activated) {
      res.status(400);
      return next(new Error("Account already activated"));
    }
    user.activated = true;
    await user.save();
    res.status(200).json({
      error: false,
      message: "Account activated",
    });
  } catch (err) {
    return next(new Error("Unknown error occurred"));
  }
};
