import express, { Router } from "express";
import {
  deleteUser,
  getOneUser,
  getUser,
  LoginUser,
  registerUser,
  updateUser,
} from "../Controllers/UserController";

const router = Router();

router.route("/").get(getUser);
router.route("/:userID ").get(getOneUser);
router.route("/create").get(registerUser);
router.route("/login").get(LoginUser);
router.route("/:userID").get(deleteUser);
router.route("/:userID").get(updateUser);

export default router;
