import { Points, Currency } from '../backend';

export function formatPoints(points: Points): string {
  return points.toString();
}

export function formatCurrency(amount: Currency): string {
  const crores = Number(amount) / 10_000_000;
  return `₹${crores.toFixed(1)} Cr`;
}

export function calculateTeamTotalPoints(playerPoints: Points[]): Points {
  return playerPoints.reduce((sum, points) => sum + points, BigInt(0));
}
