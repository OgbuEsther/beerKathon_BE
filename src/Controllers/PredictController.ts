import {NextFunction, Request , Response} from "express"
import mongoose from "mongoose";
import MatchModels from "../Models/MatchModels";
import PredictModel from "../Models/PredictModels";
import UserModels from "../Models/UserModels";
import AsyncHandler from "../Utils/AsyncHandler"


//this is to create a prediction

export const createPrediction = AsyncHandler(async(req:Request  , res:Response, next:NextFunction)=>{
    const { id, ID } = req.params;
    const { teamAScore, teamBScore, amount } = req.body;
    const user = await UserModels.findById(id);
    const match = await MatchModels.findById(ID);

    if(user){
       if(match?.stopPlay){
        return res.status(400).json({
            message : "the match has ended"
        })
       } else{
        const newMatch = await PredictModel.create({
            teamA: match?.teamA,
            teamB: match?.teamB,
            teamAScore,
            teamBScore,
            amount,
            prize: match?.Odds! * amount,
  
            scoreEntry: `${teamAScore} v ${teamBScore}`,
          });

          user.predict.push(new mongoose.Types.ObjectId(newMatch?._id));
          user.save();
          console.log(newMatch);
          
          match?.predict.push(new mongoose.Types.ObjectId(newMatch?._id));
          match?.save();
          console.log(newMatch);
          return res.status(201).json({
            message: "Prediction entry successful",
            data: newMatch,
          });
       }
        
    }

})