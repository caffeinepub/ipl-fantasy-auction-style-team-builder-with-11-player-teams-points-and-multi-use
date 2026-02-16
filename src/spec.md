# Specification

## Summary
**Goal:** Build an IPL fantasy auction-style team builder where authenticated users can create and manage independent 11-player teams with player points and team total points.

**Planned changes:**
- Add Internet Identity login and scope all stored/read data by the authenticated principal.
- Implement backend data models and methods for players (name, role, club/team, base cost/value, points/points history), user teams, and team rosters.
- Enforce exactly 11 players per team with clear UI validation and backend rejection on invalid roster sizes, including a roster count indicator (e.g., “8/11 selected”).
- Implement points display per player and computed total points per team that updates after roster changes.
- Build a step-by-step UI flow: create team name → browse/search/filter players (by name and role) and select → review roster (must be 11) and confirm → view/manage existing teams (including removing/replacing players before confirming).
- Apply a consistent cricket/league visual theme across the app without a blue/purple-dominant primary palette.
- Add and reference generated static images from `frontend/public/assets/generated` (logo and hero/illustration).

**User-visible outcome:** Users can sign in with Internet Identity, create a team, search/filter and select exactly 11 players, see per-player points and team total points, confirm their roster, and view/manage only their own saved teams.
