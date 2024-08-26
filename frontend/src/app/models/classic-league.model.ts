export interface ClassicLeagueStandings {
  league: League[];
  standings: Standings[];
}

interface League {
  id: number;
  name: string;
  created: string;
  closed: boolean;
  max_entries: number;
  league_type: string;
  scoring: string;
  admin_entry: string;
  start_event: number;
  code_privacy: string;
  has_cup: boolean;
  cup_league: string;
  rank: number;
}

export interface Standings {
  results: Results[];
}

export interface Results {
  id: number;
  event_total: number;
  player_name: string;
  rank: number;
  last_rank: number;
  rank_sort: number;
  total: number;
  entry: number;
  entry_name: string;
}
