export interface iUser {
  name: string;
  email: string;
  userName: string;
  phoneNumber: number;
  isAdmin: boolean;
  password: string;
  confirmPassword: string;
  predict: any[];
}

export interface iMatch {
  startPlay: boolean;
  stopPlay: boolean;

  teamA: string;
  teamB: string;

  teamBOdds: number;
  Odds: number;

  teamAScore: number;
  teamBScore: number;

  dateTime: string;

  scoreEntry: string;

  predict: any[];
}
