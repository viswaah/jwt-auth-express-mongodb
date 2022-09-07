import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

interface JwtPayloadWithId extends JwtPayload {
  id: string;
}

const protect = (req: Request, res: Response, next: NextFunction) => {
  let token;
  const JWT_SECRET = process.env.JWT_SECRET || "okayvis";
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithId;
      res.locals.userId = decoded.id;
      return next();
    } catch (err) {
      res.status(401);
      return next(new Error("Not Authorized"));
    }
  }
};

export { protect };
