// Database model
export interface NBAGameModel {
    id: number;
    game_id: string;
    game_date: string;
    game_time: string;
    arena: string;
    city: string;
    state: string;
    country: string;
    home_team_id: number;
    home_team: string;
    home_team_abbreviation: string;
    away_team_id: number;
    away_team: string;
    away_team_abbreviation: string;
    broadcast_networks: string;
    game_status: string;
    season_year: string;
    season_stage: string;
    created_at: string;
    updated_at: string;
    is_playoff: boolean;
    playoff_round: string | null;
    series_game_number: string | null;
    series_summary: string | null;
}

// API response types
export type GameStatus = 'LIVE' | 'UPCOMING' | 'FINISHED';

export interface Team {
    id: number;
    name: string;
    abbr: string;
}

export interface Venue {
    arena: string;
    city: string;
    state: string;
    country: string;
}

export interface PlayoffInfo {
    round: string | null;
    gameNumber: string | null;
    summary: string | null;
}

export interface Game {
    id: number;
    gameId: string;
    status: GameStatus;
    time: string;
    teamOne: Team;
    teamTwo: Team;
    scoreOne: string;
    scoreTwo: string;
    venue: Venue;
    date: string;
    broadcastOn: string;
    isPlayoff: boolean;
    playoffInfo: PlayoffInfo;
    action?: string;
}

export interface GamesApiResponse {
    success: boolean;
    count: number;
    data: Game[];
    error?: string;
}

// Component props types
export interface MatchCardProps {
    status: GameStatus;
    time: string;
    teamOne: Team;
    teamTwo: Team;
    scoreOne: string;
    scoreTwo: string;
    action: string;
}