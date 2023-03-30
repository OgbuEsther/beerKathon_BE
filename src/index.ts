import express, { Application, Request, Response } from "express";
import { DBCONNECTION } from "./Config/Database";
import EnvironmentalVariables from "./Config/EnvironmentalVariables";

import { AppConfig } from "./app";

// const PORT = EnvironmentVariables.PORT;
const Port = 3090;
// const Port = EnvironmentalVariables.PORT;

const app: Application = express();
AppConfig(app);
DBCONNECTION();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Server is up and running",
  });
});

const server = app.listen(Port, () => {
  console.log("");
  console.log("Server is up and running on port", Port);
});

// To protect my server from crashing when users do what they are not supposed to do

process.on("uncaughtException", (err: Error) => {
  console.log("shutting down server: uncaughtException");
  console.log(err);

  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("shutting down server: unhandledRejection");
  console.log(reason);

  server.close(() => {
    process.exit(1);
  });
});
