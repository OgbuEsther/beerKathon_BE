import express, { Application, NextFunction, Request, Response } from "express";
import UserRouter from "./Routes/UserRoute";
import cors from "cors";

import morgan from "morgan";
import { ErrorHandler } from "./Middlewares/Errorhandle/Errorhandle";
import { AppError, Https } from "./Utils/AppError";

export const AppConfig = (app: Application) => {
  //Intializing middlewares
  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // Configuring the routes:
  app.use("/api", UserRouter);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(
      new AppError({
        message: `This router ${req.originalUrl} does not exist`,
        httpcode: Https.NOT_FOUND,
        name: "Route Error",
        isOperational: false,
      })
    );
  });
  app.use(ErrorHandler);
};
