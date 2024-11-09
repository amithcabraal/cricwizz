/// <reference types="vite/client" />

interface Match {
  id: number;
  localteam: Team;
  visitorteam: Team;
  venue?: Venue;
  status: string;
  runs?: number;
  wickets?: number;
  batting?: BattingScore[];
  balls?: Ball[];
  data?: any; // For API response structure
}

interface Team {
  id: number;
  name: string;
}

interface Venue {
  id: number;
  name: string;
}

interface BattingScore {
  player_id: number;
  batsman: {
    fullname: string;
  };
  score: number;
  ball: number;
  four_x: number;
  six_x: number;
  rate: number;
}

interface Ball {
  ball: number;
  score: number;
}

interface APIError extends Error {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}