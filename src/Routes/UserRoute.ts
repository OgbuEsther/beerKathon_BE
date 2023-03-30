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
  GetSingleUser,
  UsersLogin,
  UsersRegistration,
} from "../Controllers/UserController";

import {
  UserRegisterValidation,
  UserLoginValidation,
} from "../Middlewares/UserValidation/UserValidation";

const UserRouter = express.Router();

UserRouter.route("/registeruser").post(
  UserRegisterValidation,
  UsersRegistration
);

UserRouter.route("/loginuser").post(UserLoginValidation, UsersLogin);

UserRouter.route("/getsingleuser/:userID").get(GetSingleUser);

export default UserRouter;
