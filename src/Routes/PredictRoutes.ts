import express from "express";
import {
  createPrediction,
  viewAllPredictions,
  allPredictions,
  predictionTable,
  userPredictionTable,
} from "../Controllers/PredictController";

const router = express.Router();

router.route("/:userid/view-user-predictions").get(viewAllPredictions);

router.route("/:id/:ID/create-prediction").post(createPrediction);

router.route("/prediction").get(allPredictions);

router.route("/leader-table").get(predictionTable);

export default router;
