"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const UserRoute_1 = __importDefault(require("./Routes/UserRoute"));
const MatchRoutes_1 = __importDefault(require("./Routes/MatchRoutes"));
const PredictRoutes_1 = __importDefault(require("./Routes/PredictRoutes"));
const AppError_1 = require("./Utils/AppError");
const ErrorHandler_1 = require("./Middlewares/ErrorHandler/ErrorHandler");
const AppConfig = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    // Configuring the routes:
    app.use("/api", UserRoute_1.default);
    app.use("/api", MatchRoutes_1.default);
    app.use("/api", PredictRoutes_1.default);
    app.all("*", (req, res, next) => {
        next(new AppError_1.AppError({
            message: `This router ${req.originalUrl} does not exist`,
            httpcode: AppError_1.HTTPCODES.NOT_FOUND,
            name: "Route Error",
            isOperational: false,
        }));
    });
    app.use(ErrorHandler_1.ErrorHandler);
};
exports.AppConfig = AppConfig;
