import { NextFunction, Request, Response } from "express";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import bcrypt from "bcrypt";
import AsyncHandler from "../Utils/AsyncHandler";

// Get all users:
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await UserModels.find();

    return res.status(200).json({
      message: "All users successfully gotten",
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({
      message: "An error occured in getting all users",
      data: err.message,
    });
  }
};

// Get a single User:
export const GetSingleUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleuser = await UserModels.findById(req.params.userID).populate({
      path: "predicts",
    });

    if (!singleuser) {
      next(
        new AppError({
          message: "User not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single user",
      data: singleuser,
    });
  }
);

// //Getting All users
// export const getUser = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = await UserModel.find();

//       return res.status(Https.CREATED).json({
//         message: "found",
//         data: user,
//       });
//     } catch (err: any) {
//       return res.status(Https.NOT_FOUND).json({
//         message: "Error",
//         data: err.message,
//       });
//     }
//   }
// );

// //creating a user
// export const registerUser = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { name, userName, password, email, confirmPassword, phoneNumber } =
//         req.body;

//       const salt = await bcrypt.genSalt(12);
//       const hashed = await bcrypt.hash(password, salt);

//       const user = await UserModel.findOne({ email });
//       //checking if the user already exists
//       // if (user) {
//       //   next(
//       //     new AppError({
//       //       message: "User already exits with this account",
//       //       httpcode: Https.FORBIDDEN,
//       //     })
//       //   );
//       // }
//       //Checking id there is the user is not registered
//       if (!user) {
//         next(
//           new AppError({
//             message: "User does not exist please create account",
//             httpcode: Https.FORBIDDEN,
//           })
//         );
//       } else {
//         const creatingUser = await UserModel.create({
//           name,
//           email,
//           userName,
//           password: hashed,
//           confirmPassword: hashed,
//           phoneNumber: "+234" + phoneNumber,
//         });
//         return res.status(Https.OK).json({
//           message: "found",
//           data: creatingUser,
//         });
//       }
//     } catch (err: any) {
//       return res.status(Https.NOT_FOUND).json({
//         message: "Error",
//         data: err.message,
//       });
//     }
//   }
// );
// export const LoginUser = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { password, email, confirmPassword } = req.body;

//       const checkEmail = await UserModel.findOne({ email, password });
//       //checking if the user already exists
//       if (!checkEmail) {
//         next(
//           new AppError({
//             message: "User already exits with this account",
//             httpcode: Https.FORBIDDEN,
//           })
//         );
//       }
//       //comparing my password using Bcrypt
//       const checkpassword = await bcrypt.compare(
//         password,
//         checkEmail!.password
//       );

//       if (!checkpassword) {
//         next(
//           new AppError({
//             message: "Password is not correct",
//             httpcode: Https.CONFLICT,
//           })
//         );
//       }

//       //comparing the email and password
//       if (checkpassword && checkEmail) {
//         return res.status(200).json({
//           message: "Login Successfull",
//           data: checkEmail,
//         });
//       }
//     } catch (err: any) {
//       return res.status(Https.NOT_FOUND).json({
//         message: "Error",
//         data: err.message,
//       });
//     }
//   }
// );

// //getting  a  Single User
// export const getOneUser = AsyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email, password } = req.body;
//       const user = await UserModel.findById(req.params.userID);
//       const findemail = await UserModel.findOne({ email });

//       //checking if the user already exists
//       if (findemail) {
//         next(
//           new AppError({
//             message: "User already exists",
//             httpcode: Https.FORBIDDEN,
//           })
//         );
//       }

//       return res.status(Https.OK).json({
//         message: "found",
//         data: user,
//       });
//     } catch (err: any) {
//       return res.status(Https.NOT_FOUND).json({
//         message: "Error",
//         data: err.message,
//       });
//     }
//   }
// );

// //updating a user
// export const updateUser = AsyncHandler(async (req: Request, res: Response) => {
//   try {
//     const { userID } = req.params;
//     const { userName } = req.body;
//     const user = await UserModel.findByIdAndUpdate(
//       userID,
//       { userName },
//       { new: true }
//     );

//     return res.status(Https.OK).json({
//       message: "found",
//       data: user,
//     });
//   } catch (err: any) {
//     return res.status(Https.NOT_FOUND).json({
//       message: "Error",
//       data: err.message,
//     });
//   }
// });

// //deleting a user
// export const deleteUser = AsyncHandler(async (req: Request, res: Response) => {
//   try {
//     const { userName } = req.body;
//     const user = await UserModel.findByIdAndDelete(req.params.UserID);

//     return res.status(200).json({
//       message: "found",
//       data: user,
//     });
//   } catch (err: any) {
//     return res.status(404).json({
//       message: "Error",
//       data: err.message,
//     });
//   }
// });
