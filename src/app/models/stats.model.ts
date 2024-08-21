export interface Stats {
  identifier: string;
  a: StatsDetail[];
  h: StatsDetail[];
}

interface StatsDetail {
  value: number;
  element: number;
}
