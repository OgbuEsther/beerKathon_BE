// import express, { Router } from "express";
// import {
//   deleteUser,
//   getOneUser,
//   getUser,
//   LoginUser,
//   registerUser,
//   updateUser,
// } from "../Controllers/UserController";

// const router = Router();

// router.route("/getAll").get(getUser);
// router.route("/:userID ").get(getOneUser);
// router.route("/create").post(registerUser);
// router.route("/login").post(LoginUser);
// router.route("/:userID").delete(deleteUser);
// router.route("/:userID").patch(updateUser);

// export default router;

import express from "express";
import {
  DeleteAUser,
  GetSingleUser,
  GetUser,
  updateOneUser,
  UsersLogin,
  UsersRegistration,
} from "../Controllers/UserController";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/UserValidation/UserValidation";

const UserRouter = express.Router();

// user registration routes:
UserRouter.route("/registeruser").post(
  UserRegisterValidation,
  UsersRegistration
);

// user login routes:
UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);

// get single user:
UserRouter.route("/getsingleuser/:userID").get(GetSingleUser);

// All user routes:
UserRouter.route("/getsingleuser").get(GetUser);

// Update user routes:
UserRouter.route("/updateuser/:userID").patch(updateOneUser);

// Delete user routes:
UserRouter.route("/deleteuser/:userID").delete(DeleteAUser);

export default UserRouter;
