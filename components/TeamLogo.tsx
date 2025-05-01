// components/TeamLogo.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Team } from '@/types/nba-games';

// Mapping of team IDs to logo URLs
const TEAM_LOGOS: Record<number, string> = {
    1610612737: 'https://cdn.nba.com/logos/nba/1610612737/global/L/logo.svg', // Hawks
    1610612738: 'https://cdn.nba.com/logos/nba/1610612738/global/L/logo.svg', // Celtics
    1610612751: 'https://cdn.nba.com/logos/nba/1610612751/global/L/logo.svg', // Nets
    1610612766: 'https://cdn.nba.com/logos/nba/1610612766/global/L/logo.svg', // Hornets
    1610612741: 'https://cdn.nba.com/logos/nba/1610612741/global/L/logo.svg', // Bulls
    1610612739: 'https://cdn.nba.com/logos/nba/1610612739/global/L/logo.svg', // Cavaliers
    1610612742: 'https://cdn.nba.com/logos/nba/1610612742/global/L/logo.svg', // Mavericks
    1610612743: 'https://cdn.nba.com/logos/nba/1610612743/global/L/logo.svg', // Nuggets
    1610612765: 'https://cdn.nba.com/logos/nba/1610612765/global/L/logo.svg', // Pistons
    1610612744: 'https://cdn.nba.com/logos/nba/1610612744/global/L/logo.svg', // Warriors
    1610612745: 'https://cdn.nba.com/logos/nba/1610612745/global/L/logo.svg', // Rockets
    1610612754: 'https://cdn.nba.com/logos/nba/1610612754/global/L/logo.svg', // Pacers
    1610612746: 'https://cdn.nba.com/logos/nba/1610612746/global/L/logo.svg', // Clippers
    1610612747: 'https://cdn.nba.com/logos/nba/1610612747/global/L/logo.svg', // Lakers
    1610612763: 'https://cdn.nba.com/logos/nba/1610612763/global/L/logo.svg', // Grizzlies
    1610612748: 'https://cdn.nba.com/logos/nba/1610612748/global/L/logo.svg', // Heat
    1610612749: 'https://cdn.nba.com/logos/nba/1610612749/global/L/logo.svg', // Bucks
    1610612750: 'https://cdn.nba.com/logos/nba/1610612750/global/L/logo.svg', // Timberwolves
    1610612740: 'https://cdn.nba.com/logos/nba/1610612740/global/L/logo.svg', // Pelicans
    1610612752: 'https://cdn.nba.com/logos/nba/1610612752/global/L/logo.svg', // Knicks
    1610612760: 'https://cdn.nba.com/logos/nba/1610612760/global/L/logo.svg', // Thunder
    1610612753: 'https://cdn.nba.com/logos/nba/1610612753/global/L/logo.svg', // Magic
    1610612755: 'https://cdn.nba.com/logos/nba/1610612755/global/L/logo.svg', // 76ers
    1610612756: 'https://cdn.nba.com/logos/nba/1610612756/global/L/logo.svg', // Suns
    1610612757: 'https://cdn.nba.com/logos/nba/1610612757/global/L/logo.svg', // Trail Blazers
    1610612758: 'https://cdn.nba.com/logos/nba/1610612758/global/L/logo.svg', // Kings
    1610612759: 'https://cdn.nba.com/logos/nba/1610612759/global/L/logo.svg', // Spurs
    1610612761: 'https://cdn.nba.com/logos/nba/1610612761/global/L/logo.svg', // Raptors
    1610612762: 'https://cdn.nba.com/logos/nba/1610612762/global/L/logo.svg', // Jazz
    1610612764: 'https://cdn.nba.com/logos/nba/1610612764/global/L/logo.svg', // Wizards
};

// Default team if none provided
const DEFAULT_TEAM: Team = {
    id: 0,
    name: 'Unknown',
    abbr: 'UNK'
};

interface TeamLogoProps {
    team?: Team;
    size?: number;
    className?: string;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ team = DEFAULT_TEAM, size = 40, className = '' }) => {
    const [imageError, setImageError] = useState(false);

    // Generate a fallback logo URL based on team ID
    const getLogoUrl = (teamId: number): string => {
        return TEAM_LOGOS[teamId] || '';
    };

    // Logo URL based on team ID
    const logoUrl = getLogoUrl(team.id);

    // If no logo URL or image fails to load
    if (!logoUrl || imageError) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-200 rounded-full ${className}`}
                style={{ width: size, height: size }}
            >
                {team.abbr || '?'}
            </div>
        );
    }

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <Image
                src={logoUrl}
                alt={`${team.name || 'Team'} logo`}
                width={size}
                height={size}
                className="object-contain"
                onError={() => setImageError(true)}
                unoptimized
            />
        </div>
    );
};

export default TeamLogo;