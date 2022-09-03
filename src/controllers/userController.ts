import User from "../models/user";
import { NextFunction, Request, Response } from "express";

interface SignUpRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
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
      const newUser = await User.create({
        name,
        email,
        password,
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
