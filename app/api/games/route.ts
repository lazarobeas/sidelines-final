import { NextResponse } from 'next/server';
import {createClient} from "@/utils/supabase/client";

// Define your game type
export interface NBAGame {
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

export async function GET(request: Request) {
    try {
        // Parse the URL to get query parameters
        const { searchParams } = new URL(request.url);

        // Get query parameters with defaults
        const days = searchParams.get('days') ? parseInt(searchParams.get('days')!) : 7;
        const team_id = searchParams.get('team_id');
        const is_playoff = searchParams.get('is_playoff');

        // Calculate date range
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + days);

        // Format dates for Supabase query
        const todayStr = today.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];

        // Use your existing service role client
        const supabase = createClient();

        // Start query
        let query = supabase
            .from('nba_upcoming_games')
            .select('*')
            .gte('game_date', todayStr)
            .lte('game_date', endDateStr)
            .order('game_date', { ascending: true })
            .order('game_time', { ascending: true });

        // Add team filter if provided
        if (team_id) {
            query = query.or(`home_team_id.eq.${team_id},away_team_id.eq.${team_id}`);
        }

        // Add playoff filter if provided
        if (is_playoff) {
            query = query.eq('is_playoff', is_playoff === 'true');
        }

        // Execute query
        const { data, error } = await query;

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch NBA games' },
                { status: 500 }
            );
        }

        // Process data to get it in the correct format for frontend
        const games = data.map((game) => {
            // Get game status and time display logic
            let statusDisplay = game.game_status.trim();
            let timeDisplay = '';

            // Process different game statuses
            if (statusDisplay.includes('pm ET') || statusDisplay.includes('am ET')) {
                timeDisplay = statusDisplay;
                statusDisplay = 'UPCOMING';
            } else if (statusDisplay.includes('Qtr') || statusDisplay.includes('OT')) {
                timeDisplay = statusDisplay;
                statusDisplay = 'LIVE';
            } else if (statusDisplay === 'Final' || statusDisplay === 'F/OT') {
                timeDisplay = 'FT';
                statusDisplay = 'FINISHED';
            } else if (statusDisplay === 'TBD') {
                timeDisplay = 'TBD';
                statusDisplay = 'UPCOMING';
            } else if (statusDisplay === 'Halftime') {
                timeDisplay = 'Halftime';
                statusDisplay = 'LIVE';
            } else {
                timeDisplay = statusDisplay;
                statusDisplay = 'UPCOMING';
            }

            return {
                id: game.id,
                gameId: game.game_id,
                status: statusDisplay,
                time: timeDisplay,
                teamOne: {
                    id: game.home_team_id,
                    name: game.home_team,
                    abbr: game.home_team_abbreviation
                },
                teamTwo: {
                    id: game.away_team_id,
                    name: game.away_team,
                    abbr: game.away_team_abbreviation
                },
                // Assume scores aren't available if it's an upcoming game
                scoreOne: statusDisplay === 'UPCOMING' ? '-' : '0',
                scoreTwo: statusDisplay === 'UPCOMING' ? '-' : '0',
                venue: {
                    arena: game.arena,
                    city: game.city,
                    state: game.state,
                    country: game.country
                },
                date: game.game_date,
                broadcastOn: game.broadcast_networks,
                isPlayoff: game.is_playoff,
                playoffInfo: {
                    round: game.playoff_round,
                    gameNumber: game.series_game_number,
                    summary: game.series_summary
                }
            };
        });

        // Return the games data
        return NextResponse.json({
            success: true,
            count: games.length,
            data: games
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch NBA games' },
            { status: 500 }
        );
    }
}