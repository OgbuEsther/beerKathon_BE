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
      message: "found",
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({
      message: "Error",
      data: err.message,
    });
  }
};

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findEmail = await UserModels.findOne({ email });

    if (findEmail) {
      next(
        new AppError({
          message: "User with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const Users = await UserModels.create({
      name,
      email,
      username,
      phoneNumber: "234" + phoneNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      status: "User",
    });

    return res.status(201).json({
      message: "Successfully created User",
      data: Users,
    });
  }
);

// Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const CheckEmail = await UserModels.findOne({ email });

    if (!CheckEmail) {
      next(
        new AppError({
          message: "User not Found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    const CheckPassword = await bcrypt.compare(password, CheckEmail!.password);

    if (!CheckPassword) {
      next(
        new AppError({
          message: "Email or password not correct",
          httpcode: HTTPCODES.CONFLICT,
        })
      );
    }

    if (CheckEmail && CheckPassword) {
      return res.status(200).json({
        message: "Login Successfull",
        data: CheckEmail,
      });
    }
  }
);

// Get a single User:
export const GetSingleUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleuser = await UserModels.findById(req.params.userID).populate({
      path: "companyGiftCards",
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

// User wants to buy a business gift card using Kora's APIs to make Payment with ATM card - // User wants to buy a business gift card using payment with their card:
export const UserBuyAGiftCardWithATMcard = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      amount,
      name,
      number,
      cvv,
      pin,
      expiry_year,
      expiry_month,
      title,
      description,
    } = req.body;

    const GenerateTransactionReference = uuid();

    // To get both single user and business
    const user = await UserModels.findById(req.params.userID);
    const Business = await BusinessModels.findById(req.params.businessID);
    const giftcard = await GiftCardModels.findById(req.params.giftcardID);

    if (!user && !Business && !giftcard) {
      next(
        new AppError({
          message: "Invalid Account, Does not exist",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    // If no gift card from this business:
    if (!Business?.giftCard) {
      next(
        new AppError({
          message: `${Business?.name} does not have a gift card yet`,
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    if (user && Business && giftcard) {
      // For user to make the payment from their bank to business wallet:
      const paymentData = {
        reference: GenerateTransactionReference,
        card: {
          name,
          number,
          cvv,
          pin,
          expiry_year,
          expiry_month,
        },
        amount,
        currency: "NGN",
        redirect_url: "https://merchant-redirect-url.com",
        customer: {
          name: user?.name,
          email: user?.email,
        },
        metadata: {
          internalRef: "JD-12-67",
          age: 15,
          fixed: true,
        },
      };

      // To stringify the payment data coming in
      const stringData = JSON.stringify(paymentData);
      //The data should be in buffer form according to Kora's pay
      const bufData = Buffer.from(stringData, "utf-8");
      const encryptedData = encryptAES256(encrypt, bufData);

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: urlData,
        headers: {
          Authorization: `Bearer ${secret}`,
        },
        data: {
          charge_data: `${encryptedData}`,
        },
      };

      axios(config)
        .then(async function (response) {
          // To update the balance of the business with the amount the user bought with ATM card
          await BusinessModels.findByIdAndUpdate(Business?._id, {
            Balance: Business?.Balance + amount,
          });
          // To generate a receipt for the business and a notification
          const BusinesstransactionHistory = await HistoryModels.create({
            owner: Business?.name,
            message: `${user?.name} bought a gift card from your store with money worth of ${amount}`,
            transactionReference: GenerateTransactionReference,
            transactionType: "Credit",
          });

          Business?.TransactionHistory?.push(
            new mongoose.Types.ObjectId(BusinesstransactionHistory?._id)
          );
          Business.save();

          // To update the history of the user with his/her debit alert of buying a gift card
          const UserTransactionHistory = await HistoryModels.create({
            owner: user?.name,
            message: `You bought a gift card worth ${amount} from ${Business?.name}`,
            transactionReference: GenerateTransactionReference,
            transactionType: "Debit",
          });

          user?.TransactionHistory?.push(
            new mongoose.Types.ObjectId(UserTransactionHistory?._id)
          );
          user.save();

          return res.status(HTTPCODES.OK).json({
            message: `${user?.name} successfully made payments for ${Business?.name} gift cards`,
            data: {
              paymentInfo: UserTransactionHistory,
              paymentData: JSON.parse(JSON.stringify(response.data)),
            },
          });
        })
        .catch(function (error) {
          next(
            new AppError({
              message: "Transaction failed",
              httpcode: HTTPCODES.BAD_GATEWAY,
              name: "Network Error",
            })
          );
        });
    }
  }
);

// Get single Business Account history:
export const GetSingleUserHistory = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const SingleUserHistory = await BusinessModels.findById(
      req.params.userID
    ).populate({
      path: "Histories",
      options: {
        createdAt: -1,
      },
    });

    if (!SingleUserHistory) {
      next(
        new AppError({
          message: "User History not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this business account",
      data: SingleUserHistory,
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
