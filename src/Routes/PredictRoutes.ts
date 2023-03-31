import express from "express";
import {
  userPredictionTable,
  ViewAllPredictions,
  CreatePrediction,
  AllPredictions,
  PredictionTable,
} from "../Controllers/PredictController";

const router = express.Router();

router.route("/:userid/view-user-predictions").get(ViewAllPredictions);

router.route("/:id/user-predictions").get(userPredictionTable);

router.route("/:id/:ID/create-prediction").post(CreatePrediction);

router.route("/prediction").get(AllPredictions);

router.route("/leader-table").get(PredictionTable);

export default router;
