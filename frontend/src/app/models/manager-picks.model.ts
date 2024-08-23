export interface ManagerPicks {
  active_chip: string;
  automatic_subs: AutomaticSubs[];
  entry_history: EntryHistory;
  stats: AutomaticSubs[];
  picks: AutomaticSubs[];
}

export interface AutomaticSubs {
  element: number;
  position: number;
  multiplier: number;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export interface EntryHistory {
  event: number;
  points: number;
  total_points: number;
  rank: number;
  rank_sort: number;
  overall_rank: number;
  percentile_rank: number;
  bank: number;
  value: number;
  event_transfers: number;
  event_transfers_cost: number;
  points_on_bench: number;
}
