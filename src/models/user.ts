import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  userId: string;
  password: string;
  emailToken: string;
  emailTokenExp: Date;
  activated: boolean;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  userId: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  activated: { type: Boolean, default: false },
  emailToken: { type: String, default: null },
  emailTokenExp: { type: Date, default: null },
});

export default model<IUser>("User", userSchema);
