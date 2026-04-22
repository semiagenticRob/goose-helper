export type Period = 'week' | 'month' | 'quarter';

export type PersonBreakdown = {
  confirmedBillable: number;
  unmappedProbable: number;
  nonBillable: number;
  hoursWorked: number;
  hoursAvailable: number;
};

export type PersonRow = {
  name: string;
  utilization: number;
  unmappedHours: number;
  breakdown: PersonBreakdown;
};

export type PeriodSlice = {
  confirmedBillable: number;
  unmappedProbable: number;
  nonBillable: number;
  mappingConfidence: number;
  trend: number[];
  people: PersonRow[];
};

export type Team = {
  id: 'a' | 'b';
  name: string;
  type: 'external' | 'project';
  target: number;
  periods: Record<Period, PeriodSlice>;
};

export type DashboardData = {
  teams: [Team, Team];
};
