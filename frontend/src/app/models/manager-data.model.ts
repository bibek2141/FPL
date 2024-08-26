export interface ManagerData {
  id: number;
  joined_time: string;
  started_event: number;
  favourite_team: number;
  player_first_name: string;
  player_last_name: string;
  player_region_id: number;
  player_region_name: string;
  player_region_iso_code_short: string;
  player_region_iso_code_long: string;
  years_active: number;
  summary_overall_points: number;
  summary_overall_rank: number;
  summary_event_points: number;
  summary_event_rank: number;
  leagues: Leagues;
  current_event: number;
}

interface Leagues {
  classic: Classic[];
}

export interface Classic {
  id: number;
  name: string;
  rank_count: number;
  entry_percentile_rank: number;
  entry_rank: number;
  active_phases: ActivePhases[];
}

export interface ActivePhases {
  phase: number;
  rank: number;
  rank_sort: number;
  total: number;
  league_id: number;
  rank_count: number;
  entry_percentile_rank: number;
}
