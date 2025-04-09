'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from "react";

// Match card component
function MatchCard({ status, time, teamOne, teamTwo, scoreOne, scoreTwo, action }) {
    // Status badge styling
    const getBadgeVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'live':
                return 'destructive';
            case 'upcoming':
                return 'secondary';
            case 'finished':
                return 'outline';
            default:
                return 'secondary';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Badge variant={getBadgeVariant(status)}>
                        {status === 'LIVE' && (
                            <span className="h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse" />
                        )}
                        {status}
                    </Badge>
                </div>
                <span className="text-sm text-gray-500 font-medium">{time}</span>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">{teamOne.abbr}</div>
                        <span className="font-medium">{teamOne.name}</span>
                    </div>
                    <span className="text-xl font-bold">{scoreOne}</span>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">{teamTwo.abbr}</div>
                        <span className="font-medium">{teamTwo.name}</span>
                    </div>
                    <span className="text-xl font-bold">{scoreTwo}</span>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-gray-100">
                    {action}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function LiveScoresSection() {
    // Sample match data
    const matches = [
        {
            id: 1,
            status: 'LIVE',
            time: 'Q4 2:45',
            teamOne: { name: 'Lakers', abbr: 'LA' },
            teamTwo: { name: 'Warriors', abbr: 'GS' },
            scoreOne: '102',
            scoreTwo: '98',
            action: 'View Details'
        },
        {
            id: 2,
            status: 'UPCOMING',
            time: 'Today, 8:30 PM',
            teamOne: { name: 'Nuggets', abbr: 'DEN' },
            teamTwo: { name: 'Kings', abbr: 'SAC' },
            scoreOne: '-',
            scoreTwo: '-',
            action: 'Set Reminder'
        },
        {
            id: 3,
            status: 'FINISHED',
            time: 'FT',
            teamOne: { name: 'Thunder', abbr: 'OKC' },
            teamTwo: { name: 'Rockets', abbr: 'HOU' },
            scoreOne: '124',
            scoreTwo: '122',
            action: 'Match Stats'
        }
    ];

    return (
        <section id="live-scores" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold mb-4">Live Scores & Updates</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Get real-time updates from all your favorite leagues and teams in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {matches.map(match => (
                        <MatchCard
                            key={match.id}
                            status={match.status}
                            time={match.time}
                            teamOne={match.teamOne}
                            teamTwo={match.teamTwo}
                            scoreOne={match.scoreOne}
                            scoreTwo={match.scoreTwo}
                            action={match.action}
                        />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Button className="bg-indigo-600 rounded-3xl border-black border-2 p-2 hover:bg-indigo-700 py-6 px-8 text-lg">
                        View All Scores <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}