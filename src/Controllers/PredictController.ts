import {NextFunction, Request , Response} from "express"
import mongoose from "mongoose";
import MatchModels from "../Models/MatchModels";
import PredictModel from "../Models/PredictModels";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import AsyncHandler from "../Utils/AsyncHandler"


//this is to create a prediction

export const createPrediction = AsyncHandler(async(req:Request  , res:Response, next:NextFunction)=>{
    const { id, ID } = req.params;
    const { teamAScore, teamBScore, amount } = req.body;
    const user = await UserModels.findById(id);
    const match = await MatchModels.findById(ID);

    if(user){
       if(match?.stopPlay){
        return res.status(HTTPCODES.BAD_REQUEST).json({
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
        
          
          match?.predict.push(new mongoose.Types.ObjectId(newMatch?._id));
          match?.save();
   
          return res.status(201).json({
            message: "Prediction entry successful",
            data: newMatch,
          });
       }
        
    }else{
        next(
            new AppError({
                message : "user can't be found",
                httpcode : HTTPCODES.BAD_REQUEST
            })
        )
    }

    

})


// view all predictions

export const viewAllPredictions = async (req: Request, res: Response) => {
    try {
      const { userid } = req.params;
      const user = await UserModels.findById(userid).populate({
        path: "predict",
        options: {
          createdAt: -1,
        },
      });
  
      return res.status(404).json({
        message: "user prediction",
        data: user?.predict,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Erro",
      });
    }
  };
  