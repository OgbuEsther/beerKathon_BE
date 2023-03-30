import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

interface iUser {
  phoneNumber: number;
  isAdmin: boolean;
  email: string;
  password: string;
  userName: string;
  name: string;
  confirmPassword: string;
  predict: any[];
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema<iUserData>(
  {
    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    userName: {
      type: String,
      required: [true, "Please enter your Username"],
    },
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    phoneNumber: {
      type: Number,
    },

    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
    },

    predict: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "predicts",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("users", userModel);
