import User from "../models/user";
import { Request, Response } from "express";

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
export const signUp = async (req: SignUpRequest, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400).json({
      error: true,
      message: "All fields are required",
    });
  } else if (password !== confirmPassword) {
    res.status(400).json({
      error: true,
      message: "Password doesn't match",
    });
  }
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({
        error: true,
        message: "User already exists",
      });
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
    res.status(500).json({
      error: true,
      message: "Unknown error occured",
    });
  }
};
