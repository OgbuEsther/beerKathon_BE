import { Request, Response, NextFunction } from "express";
import MatchModels from "../Models/MatchModels";
import UserModels from "../Models/UserModels";
import { AppError, HTTPCODES } from "../Utils/AppError";
import AsyncHandler from "../Utils/AsyncHandler";

// ADMIN CREATE MATCHES:
export const CreateMatch = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { teamA, teamB, teamAScore, teamBScore, Odds, dateTime } = req.body;

    const user = await UserModels.findById(req.params.userID);

    if (user?.isAdmin) {
      const Match = await MatchModels.create({
        teamA,
        teamB,
        teamAScore: 0,
        teamBScore: 0,
        Odds,
        stopPlay: false,
        startPlay: false,
        scoreEntry: `${teamAScore} VS ${teamBScore}`,
        dateTime,
      });

      return res.status(HTTPCODES.OK).json({
        message: "Successfully created Match",
        data: Match,
      });
    } else {
      next(
        new AppError({
          message: "You are not authorized to create match",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }
  }
);

// ADMIN AND USERS VIEW ALL MATCHES:
export const viewAllMatch = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const Match = await MatchModels.find();

    if (!Match) {
      next(
        new AppError({
          message: "Couldn't get all Match",
          httpcode: HTTPCODES.BAD_REQUEST,
        })
      );
    }

    return res.status(HTTPCODES.OK).json({
      message: "All Matches successfully gotten",
      data: Match,
    });
  }
);

export const updateScoreMatch = async (req: Request, res: Response) => {
  try {
    const { ID, id } = req.params;
    const { teamAScore, teamBScore } = req.body;
    const user = await userModel.findById(id);
    const match = await matchModel.findById(ID);

    if (user?.isAdmin) {
      if (match && match.startPlay) {
        if (match?.stopPlay) {
          return res.json({
            message: "Match has ended",
          });
        } else {
          const match = await matchModel.findByIdAndUpdate(
            ID,
            {
              teamAScore,
              teamBScore,
              scoreEntry: `${teamAScore} v ${teamBScore}`,
            },
            { new: true }
          );

          return res.status(200).json({
            message: "found",
            data: match,
          });
        }
      } else {
        return res.status(404).json({
          message: "fill it up",
        });
      }
    } else {
      return res.status(404).json({
        message: "error in user",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateStartMatch = async (req: Request, res: Response) => {
  try {
    const { ID, id } = req.params;

    const user = await userModel.findById(id);
    const { teamAScore, teamBScore, startPlay } = req.body;

    if (user?.isAdmin) {
      const match = await matchModel.findByIdAndUpdate(
        ID,
        {
          startPlay: true,
        },
        { new: true }
      );

      setTimeout(async () => {
        await matchModel.findByIdAndUpdate(
          ID,
          {
            stopPlay: true,
          },
          { new: true }
        );
      }, 60000);

      return res.status(200).json({
        message: "found",
        data: match,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
