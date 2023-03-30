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

    
return res.status(200).json({
    message : "Success",
    
})
})


// user can view his/her predictions

export const viewAllPredictions = AsyncHandler(async (req: Request, res: Response , next:NextFunction) => {
    try {
      const { userid } = req.params;
      const user = await UserModels.findById(userid).populate({
        path: "predict",
        options: {
          createdAt: -1,
        },
      });
  

      if (!user) {
        next(
          new AppError({
            message: "User not found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
      return res.status(404).json({
        message: "user prediction",
        data: user?.predict,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error occurred in the view user prediction logic",
      });
    }
  }
)

//view all predictions (the admin is able to view all predictions)

export const allPredictions = AsyncHandler(async (req: Request, res: Response , next:NextFunction) => {
    try {
      const user = await PredictModel.find();

      if (!user) {
        next(
          new AppError({
            message: "User not found",
            httpcode: HTTPCODES.NOT_FOUND,
          })
        );
      }
  
      return res.status(200).json({
        message: "user prediction",
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error",
      });
    }
  }
)

  //the leaderboard  , making comparisons between the user predict scores and the admin actual set score
  export const predictionTable = AsyncHandler(
    async (req: Request, res: Response , next:NextFunction) => {
        try {
          const predict = await PredictModel.find();
          if (!predict) {
            next(
              new AppError({
                message: "couldn't find the predict model ",
                httpcode: HTTPCODES.FORBIDDEN,
              })
            );
          }
          const match = await MatchModels.find();
          if (!match) {
            next(
              new AppError({
                message: "couldn't get a match ",
                httpcode: HTTPCODES.FORBIDDEN,
              })
            );
          }
      
          const table = match.filter((el) => {
            return predict.some((props) => el.scoreEntry === props.scoreEntry);
          });
          if (!table) {
            next(
              new AppError({
                message: "couldn't get a correct prediction ",
                httpcode: HTTPCODES.FORBIDDEN,
              })
            );
          }
      
      
          return res.status(200).json({
            message: " prediction table",
            data: table,
          });
        } catch (error) {
          return res.status(404).json({
            message: "Error",
          });
        }
      }
  )


  //user prediction

  export const userPredictionTable = AsyncHandler(
    async (req: Request, res: Response , next:NextFunction) => {
    try {
      const { id, ID } = req.params;
      const predict = await UserModels.findById(id).populate({
        path: "predict",
      });
      const match = await MatchModels.find();
  if(!match){
    next(
        new AppError({
          message: "couldn't get match model",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );

  }
      const table = match.filter((el) => {
        return predict!.predict.some(
          (props) => el.scoreEntry === props.scoreEntry,
        );
      });

      if(!table){
        next(
            new AppError({
              message: "couldn't get user prediction",
              httpcode: HTTPCODES.FORBIDDEN,
            })
          )
      }
  
      return res.status(200).json({
        message: " prediction table",
        data: table,
      });
    } catch (error) {
      return res.status(404).json({
        message: "Error",
      });
    }
  }


  )