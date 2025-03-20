"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Clock, MapPin, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type Team = {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
};

type League = {
  id: number;
  name: string;
  slug: string;
  logo_url: string;
};

type Channel = {
  id: number;
  slug: string;
  home_team_id: number;
  away_team_id: number;
  league_id: number;
  game_date: string;
  game_status: "UPCOMING" | "LIVE" | "COMPLETED";
  score_home: number;
  score_away: number;
  game_period: string;
  time_remaining: string;
  venue: string;
  inserted_at: string;
  home_team: Team;
  away_team: Team;
  league: League;
  active_users_count: number;
};

export default function Feed() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const supabase = createClient();

  useEffect(() => {
    async function fetchChannels() {
      try {
        const { data: channelsData, error } = await supabase
          .from("channels")
          .select(`
            *,
            home_team:home_team_id(id, name, slug, logo_url, primary_color, secondary_color),
            away_team:away_team_id(id, name, slug, logo_url, primary_color, secondary_color),
            league:league_id(id, name, slug, logo_url)
          `)
          .order("game_date", { ascending: true });

        if (error) {
          console.error("Error fetching channels:", error);
          return;
        }

        // Get active users count for each channel (this would be a real implementation)
        // For now we'll mock with random numbers
        const enhancedChannels = channelsData.map(channel => ({
          ...channel,
          active_users_count: Math.floor(Math.random() * 120) + 5
        }));

        setChannels(enhancedChannels);
      } catch (error) {
        console.error("Failed to fetch channels:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannels();

    // Subscribe to changes in the channels table
    const channelsSubscription = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channels",
        },
        (payload) => {
          // Refresh the channels when there's a change
          fetchChannels();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelsSubscription);
    };
  }, [supabase]);

  const filteredChannels = channels.filter(channel => {
    if (activeTab === "all") return true;
    if (activeTab === "live") return channel.game_status === "LIVE";
    if (activeTab === "upcoming") return channel.game_status === "UPCOMING";
    if (activeTab === "completed") return channel.game_status === "COMPLETED";
    return true;
  });

  return (
    <div className="h-screen w-screen bg-[#232341] flex flex-col overflow-hidden">
      <div className="bg-[#232341] w-full">
        {/* Header with SIDELINES text */}
        <header className="py-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-300">SIDELINES</h1>
        </header>

        {/* Navigation buttons */}
        <nav className="flex justify-center gap-2 md:gap-6 my-4">
          <button 
            className={`font-bold py-2 px-4 rounded-full text-sm md:text-base ${activeTab === 'live' ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('live')}
          >
            LIVE NOW
          </button>
          <button 
            className={`font-bold py-2 px-4 rounded-full text-sm md:text-base ${activeTab === 'all' ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('all')}
          >
            SPORTS
          </button>
          <button 
            className={`font-bold py-2 px-4 rounded-full text-sm md:text-base ${activeTab === 'upcoming' ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            UPCOMING
          </button>
          <button 
            className={`font-bold py-2 px-4 rounded-full text-sm md:text-base ${activeTab === 'completed' ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('completed')}
          >
            COMPLETED
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ChannelSkeleton key={i} />
              ))}
            </div>
          ) : filteredChannels.length > 0 ? (
            <div className="space-y-4">
              {filteredChannels.map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-[#1e2142] rounded-lg p-8 text-white">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No games found</h3>
              <p className="text-sm text-gray-400 mt-2">
                There are currently no {activeTab !== "all" ? activeTab : ""} games available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChannelCard({ channel }: { channel: Channel }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "LIVE":
        return "bg-red-600 text-white";
      case "UPCOMING":
        return "bg-blue-600 text-white";
      case "COMPLETED":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getTimeInfo = () => {
    if (channel.game_status === "LIVE") {
      return `${channel.game_period} · ${channel.time_remaining}`;
    } else if (channel.game_status === "UPCOMING") {
      return formatDistanceToNow(new Date(channel.game_date), { addSuffix: true });
    } else {
      return "Final";
    }
  };

  // Assign random team colors if they don't exist for demo purposes
  const homeColor = channel.home_team.primary_color || '#F59E0B';
  const awayColor = channel.away_team.primary_color || '#3B82F6';

  return (
    <div className="bg-[#1e2142] rounded-lg overflow-hidden text-white mb-4">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <img
              src={channel.league.logo_url || "/league-placeholder.png"}
              alt={channel.league.name}
              className="w-6 h-6 mr-2 bg-white rounded-full p-0.5 "
            />
            <span className="text-sm font-medium text-gray-300">{channel.league.name}</span>
          </div>
          <Badge className={`${getStatusColor(channel.game_status)} px-3 py-1 rounded-full`}>
            {channel.game_status === "LIVE" && (
              <span className="mr-1 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            {channel.game_status}
          </Badge>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-3">
          <div className="flex items-center justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
            <div className="flex flex-col items-center text-center mr-6">
              <div 
                className="w-12 h-12 rounded-full mb-2" 
                style={{ backgroundColor: homeColor }}
              >
                <img
                  src={channel.home_team.logo_url || "/team-placeholder.png"}
                  alt={channel.home_team.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="text-sm font-semibold">{channel.home_team.name}</span>
            </div>
            
            <div className="flex flex-col items-center mx-4">
              {channel.game_status !== "UPCOMING" ? (
                <>
                  <div className="text-2xl font-bold">
                    {channel.score_home} - {channel.score_away}
                  </div>
                  <div className="text-xs text-gray-400">{getTimeInfo()}</div>
                </>
              ) : (
                <div className="text-sm font-medium text-gray-400">{getTimeInfo()}</div>
              )}
            </div>
            
            <div className="flex flex-col items-center text-center ml-6">
              <div 
                className="w-12 h-12 rounded-full mb-2" 
                style={{ backgroundColor: awayColor }}
              >
                <img
                  src={channel.away_team.logo_url || "/team-placeholder.png"}
                  alt={channel.away_team.name}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <span className="text-sm font-semibold">{channel.away_team.name}</span>
            </div>
          </div>
          
          <Link href={`/channels/${channel.slug}`} className="w-full md:w-auto">
            <Button className="w-full bg-white text-black font-bold hover:bg-gray-200 rounded-full">
              JOIN CHAT
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{channel.venue}</span>
          </div>
          <div className="flex items-center flex-wrap">
            <Calendar className="h-3 w-3 mr-1" />
            <span className="mr-3">{new Date(channel.game_date).toLocaleDateString()}</span>
            <Clock className="h-3 w-3 mr-1" />
            <span className="mr-3">{new Date(channel.game_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <Users className="h-3 w-3 mr-1" />
            <span>{channel.active_users_count} fans</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChannelSkeleton() {
  return (
    <div className="bg-[#1e2142] rounded-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-24 bg-gray-700" />
        <Skeleton className="h-5 w-16 bg-gray-700" />
      </div>
      
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center">
          <div className="flex flex-col items-center mr-4">
            <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
            <Skeleton className="w-20 h-4 mt-2 bg-gray-700" />
          </div>
          
          <div className="flex flex-col items-center mx-4">
            <Skeleton className="w-16 h-6 bg-gray-700" />
            <Skeleton className="w-12 h-3 mt-1 bg-gray-700" />
          </div>
          
          <div className="flex flex-col items-center ml-4">
            <Skeleton className="w-12 h-12 rounded-full bg-gray-700" />
            <Skeleton className="w-20 h-4 mt-2 bg-gray-700" />
          </div>
        </div>
        
        <Skeleton className="h-9 w-24 bg-gray-700" />
      </div>
      
      <div className="flex justify-between text-sm mt-3 pt-3 border-t border-gray-700">
        <Skeleton className="h-4 w-32 bg-gray-700" />
        <Skeleton className="h-4 w-40 bg-gray-700" />
      </div>
    </div>
  );
}