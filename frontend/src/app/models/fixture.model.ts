import { Stats } from './stats.model';

export interface Fixture {
  id: string;
  team_h: number;
  team_a: number;
  team_h_score: number;
  team_a_score: number;
  kickoff_time: string;
  event: number; // gameweek
  team_h_name?: string;
  team_a_name?: string;
  team_score_a?: string;
  team_score_h?: string;
  local_kickoff_time?: string;
  stats: Stats[];
}

export interface FixturesByMatchday {
  [gameweek: number]: {
    [date: string]: Fixture[];
  };
}
