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

router.route("/getAll").get(getUser);
router.route("/:userID ").get(getOneUser);
router.route("/create").post(registerUser);
router.route("/login").post(LoginUser);
router.route("/:userID").delete(deleteUser);
router.route("/:userID").patch(updateUser);

export default router;
