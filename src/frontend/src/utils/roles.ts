import { Role } from '../backend';

export function getRoleLabel(role: Role): string {
  switch (role) {
    case Role.batsman:
      return 'Batsman';
    case Role.bowler:
      return 'Bowler';
    case Role.allRounder:
      return 'All-Rounder';
    case Role.keeper:
      return 'Wicket Keeper';
    default:
      return 'Unknown';
  }
}

export function getRoleColor(role: Role): string {
  switch (role) {
    case Role.batsman:
      return 'text-chart-1 border-chart-1';
    case Role.bowler:
      return 'text-chart-2 border-chart-2';
    case Role.allRounder:
      return 'text-chart-3 border-chart-3';
    case Role.keeper:
      return 'text-chart-4 border-chart-4';
    default:
      return '';
  }
}
