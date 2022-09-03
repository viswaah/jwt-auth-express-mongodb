import User from "../models/user";
import { genSalt, hash, compare } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import "dotenv/config";

interface SignUpRequest extends Request {
  body: {
    name: string;
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

// @route POST /api/user/signup
// @access public
export const signUp = async (
  req: SignUpRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
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
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      res.status(200).json({
        error: false,
        message: "User created Successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return next(new Error("Unknown error occurred"));
  }
};

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
