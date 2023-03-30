"use strict";
// import express, { Router } from "express";
// import {
//   deleteUser,
//   getOneUser,
//   getUser,
//   LoginUser,
//   registerUser,
//   updateUser,
// } from "../Controllers/UserController";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.route("/getAll").get(getUser);
// router.route("/:userID ").get(getOneUser);
// router.route("/create").post(registerUser);
// router.route("/login").post(LoginUser);
// router.route("/:userID").delete(deleteUser);
// router.route("/:userID").patch(updateUser);
// export default router;
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controllers/UserController");
const UserValidation_1 = require("../Middlewares/UserValidation/UserValidation");
const UserRouter = express_1.default.Router();
// user registration routes:
UserRouter.route("/registeruser").post(UserValidation_1.UserRegisterValidation, UserController_1.UsersRegistration);
// user login routes:
UserRouter.route("/loginuser").post(UserValidation_1.UserLoginValidation, UserController_1.UsersLogin);
// get single user:
UserRouter.route("/getsingleuser/:userID").get(UserController_1.GetSingleUser);
// All user routes:
UserRouter.route("/getsingleuser").get(UserController_1.GetUser);
// Update user routes:
UserRouter.route("/updateuser/:userID").patch(UserController_1.updateOneUser);
// Delete user routes:
UserRouter.route("/deleteuser/:userID").delete(UserController_1.DeleteAUser);
exports.default = UserRouter;
