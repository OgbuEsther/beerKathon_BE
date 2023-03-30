import { NextFunction, Request, Response } from "express";
import UserModel from "../model/User.model";
import bcrypt from "bcrypt";
import AsyncHandler from "../Utils/AsyncHandler";
import { AppError, Https } from "../Utils/AppError";

//Getting All users
export const getUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserModel.find();

      return res.status(Https.CREATED).json({
        message: "found",
        data: user,
      });
    } catch (err: any) {
      return res.status(404).json({
        message: "Error",
        data: err.message,
      });
    }
  }
);

//creating a user
export const registerUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, userName, password, email, confirmPassword, phoneNumber } =
        req.body;

      const salt = await bcrypt.genSalt(12);
      const hashed = await bcrypt.hash(password, salt);

      const user = await UserModel.findOne({ email });
      //checking if the user already exists
      if (user) {
        next(
          new AppError({
            message: "User already exits with this account",
            httpcode: Https.FORBIDDEN,
          })
        );
      }
      //Checking id there is the user is not registered
      if (!user) {
        next(
          new AppError({
            message: "User does not exist please create account",
            httpcode: Https.FORBIDDEN,
          })
        );
      } else {
        const creatingUser = await UserModel.create({
          name,
          email,
          userName,
          password: hashed,
          confirmPassword: hashed,
          phoneNumber: "+234" + phoneNumber,
        });
        return res.status(Https.OK).json({
          message: "found",
          data: creatingUser,
        });
      }
    } catch (err: any) {
      return res.status(Https.NOT_FOUND).json({
        message: "Error",
        data: err.message,
      });
    }
  }
);

//getting  a  Single User
export const getOneUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findById(req.params.userID);
      const findemail = await UserModel.findOne({ email });

      //checking if the user already exists
      if (findemail) {
        next(
          new AppError({
            message: "User already exists",
            httpcode: Https.FORBIDDEN,
          })
        );
      }

      return res.status(Https.OK).json({
        message: "found",
        data: user,
      });
    } catch (err: any) {
      return res.status(Https.NOT_FOUND).json({
        message: "Error",
        data: err.message,
      });
    }
  }
);
