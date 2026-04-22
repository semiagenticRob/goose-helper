import type { DashboardData } from '../types';

const teamAPeople = [
  { name: 'Jamie Chen', util: 0.91 },
  { name: 'Meera Patel', util: 0.84 },
  { name: 'Ravi Vu', util: 0.81 },
  { name: 'Sarah Blum', util: 0.79 },
  { name: 'Tom Garcia', util: 0.77 },
  { name: 'Priya Nair', util: 0.75 },
  { name: 'Ben Obi', util: 0.72 },
  { name: 'Lena Park', util: 0.68 },
];

const teamBPeople = [
  { name: 'Ari Kim', util: 0.88, unmapped: 2 },
  { name: 'Sam Park', util: 0.74, unmapped: 3 },
  { name: 'Nadia Osei', util: 0.71, unmapped: 4 },
  { name: 'Luis Diaz', util: 0.61, unmapped: 8 },
  { name: 'Tina Alvi', util: 0.58, unmapped: 7 },
  { name: 'Danny Ross', util: 0.52, unmapped: 14 },
  { name: 'Hana Schmidt', util: 0.66, unmapped: 5 },
  { name: 'Zack Liu', util: 0.69, unmapped: 3 },
  { name: 'Omar Reyes', util: 0.63, unmapped: 6 },
];

function makeTeamAPeople(scale: number) {
  return teamAPeople.map(p => ({
    name: p.name,
    utilization: clamp(p.util + jitter(p.name, scale)),
    unmappedHours: 0,
  }));
}

function makeTeamBPeople(scale: number, unmappedScale: number) {
  return teamBPeople.map(p => ({
    name: p.name,
    utilization: clamp(p.util + jitter(p.name, scale)),
    unmappedHours: Math.max(0, Math.round(p.unmapped * unmappedScale)),
  }));
}

function clamp(n: number) { return Math.max(0, Math.min(0.99, n)); }
function jitter(seed: string, scale: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((h % 11) - 5) * 0.01 * scale;
}

export const mockDashboard: DashboardData = {
  teams: [
    {
      id: 'a',
      name: 'Team A · External',
      type: 'external',
      target: 0.78,
      periods: {
        week: {
          confirmedBillable: 0.84,
          unmappedProbable: 0,
          nonBillable: 0.12,
          mappingConfidence: 1,
          trend: [0.79, 0.81, 0.80, 0.83, 0.82, 0.85, 0.84, 0.84],
          people: makeTeamAPeople(1.1),
        },
        month: {
          confirmedBillable: 0.82,
          unmappedProbable: 0,
          nonBillable: 0.14,
          mappingConfidence: 1,
          trend: [0.76, 0.78, 0.79, 0.80, 0.81, 0.82, 0.83, 0.82, 0.81, 0.82, 0.82],
          people: makeTeamAPeople(1.0),
        },
        quarter: {
          confirmedBillable: 0.80,
          unmappedProbable: 0,
          nonBillable: 0.15,
          mappingConfidence: 1,
          trend: [0.74, 0.76, 0.78, 0.79, 0.80, 0.81, 0.80, 0.80],
          people: makeTeamAPeople(0.8),
        },
      },
    },
    {
      id: 'b',
      name: 'Team B · Project',
      type: 'project',
      target: 0.70,
      periods: {
        week: {
          confirmedBillable: 0.58,
          unmappedProbable: 0.14,
          nonBillable: 0.22,
          mappingConfidence: 0.69,
          trend: [0.65, 0.63, 0.68, 0.70, 0.69, 0.71, 0.72, 0.72],
          people: makeTeamBPeople(1.1, 1.1),
        },
        month: {
          confirmedBillable: 0.55,
          unmappedProbable: 0.12,
          nonBillable: 0.25,
          mappingConfidence: 0.72,
          trend: [0.60, 0.62, 0.64, 0.65, 0.67, 0.68, 0.67, 0.69, 0.68, 0.67, 0.67],
          people: makeTeamBPeople(1.0, 1.0),
        },
        quarter: {
          confirmedBillable: 0.54,
          unmappedProbable: 0.13,
          nonBillable: 0.24,
          mappingConfidence: 0.70,
          trend: [0.58, 0.60, 0.62, 0.64, 0.65, 0.66, 0.67, 0.67],
          people: makeTeamBPeople(0.8, 0.9),
        },
      },
    },
  ],
};
