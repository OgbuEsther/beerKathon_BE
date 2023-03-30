import express, { Router } from "express";
import { getUser } from "../Controllers/UserController";

const router = Router();

router.route("/").get(getUser);

export default router;
