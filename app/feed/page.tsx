"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, LogOut, MapPin, Users, Search, BellRing } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const router = useRouter();

  // Add signOut function
  const handleSignOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        return;
      }
      // Redirect to login page after successful sign out
      router.push("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }, [supabase.auth, router]);

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
            () => {
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
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a3a] to-[#0f0f29] flex flex-col overflow-hidden">
        {/* Top header with navigation */}
        <header className="bg-[#12122a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
          <div className="container mx-auto py-3 px-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                SIDE<span className="text-indigo-400">LINES</span>
              </h1>
            </div>

            {/* Search Bar (non-functional) */}
            <div className="hidden md:flex relative rounded-full bg-[#1e1e45] px-3 py-1.5 border border-white/10 w-1/3">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                  type="text"
                  placeholder="Search games..."
                  className="bg-transparent text-white pl-8 pr-4 py-1 w-full focus:outline-none"
              />
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-300 hover:text-white">
                <BellRing className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border border-indigo-400/50">
                  <AvatarImage src="/avatar-placeholder.png" />
                  <AvatarFallback className="bg-indigo-600 text-xs">US</AvatarFallback>
                </Avatar>
                <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white hover:bg-red-800/20 ml-2"
                    title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Filter tabs */}
        <div className="container mx-auto px-4 my-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Live Games</h2>
            <div className="flex gap-1 p-1 bg-[#1e1e45] rounded-lg">
              <button
                  className={`font-medium px-3 py-1.5 rounded-md text-sm transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                  className={`font-medium px-3 py-1.5 rounded-md text-sm transition-all flex items-center ${activeTab === 'live' ? 'bg-red-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setActiveTab('live')}
              >
                {activeTab === 'live' && (
                    <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                )}
                Live Now
              </button>
              <button
                  className={`font-medium px-3 py-1.5 rounded-md text-sm transition-all ${activeTab === 'upcoming' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                  className={`font-medium px-3 py-1.5 rounded-md text-sm transition-all ${activeTab === 'completed' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow container mx-auto px-4 pb-8 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                    <ChannelSkeleton key={i} />
                ))
            ) : filteredChannels.length > 0 ? (
                filteredChannels.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                ))
            ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-[#1e1e45]/50 backdrop-blur-sm rounded-xl p-8 text-white border border-white/10">
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
  // Get status color, badge and animation
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "LIVE":
        return {
          color: "text-red-500",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-500/30",
          shadow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]"
        };
      case "UPCOMING":
        return {
          color: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
          shadow: ""
        };
      case "COMPLETED":
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          shadow: ""
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-500/10",
          borderColor: "border-gray-500/30",
          shadow: ""
        };
    }
  };

  const statusStyles = getStatusStyles(channel.game_status);

  const getTimeInfo = () => {
    if (channel.game_status === "LIVE") {
      return `${channel.game_period} · ${channel.time_remaining}`;
    } else if (channel.game_status === "UPCOMING") {
      return formatDistanceToNow(new Date(channel.game_date), { addSuffix: true });
    } else {
      return "Final";
    }
  };

  // Default team colors if they don't exist
  const homeColor = channel.home_team.primary_color || '#6366F1';
  const awayColor = channel.away_team.primary_color || '#8B5CF6';

  return (
      <div className={`bg-[#1e1e45]/70 backdrop-blur-sm rounded-xl overflow-hidden text-white border border-white/5 hover:border-white/20 transition-all ${statusStyles.shadow} hover:shadow-lg hover:translate-y-[-2px]`}>
        <div className="p-5">
          {/* League and status header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              {channel.league.logo_url ? (
                  <img
                      src={channel.league.logo_url}
                      alt={channel.league.name}
                      className="w-5 h-5 mr-2 bg-white rounded-full p-0.5"
                  />
              ) : (
                  <div className="w-5 h-5 mr-2 bg-gray-700 rounded-full flex items-center justify-center text-[8px]">
                    {channel.league.name.substring(0, 2)}
                  </div>
              )}
              <span className="text-xs font-medium text-gray-300">{channel.league.name}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles.bgColor} ${statusStyles.color} border ${statusStyles.borderColor} flex items-center`}>
              {channel.game_status === "LIVE" && (
                  <span className="mr-1.5 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              )}
              {channel.game_status}
            </div>
          </div>

          {/* Teams and score */}
          <div className="flex justify-between items-center py-2">
            <div className="flex flex-col items-center justify-center text-center w-1/3">
              <div
                  className="w-16 h-16 rounded-full mb-2 p-0.5 border-2"
                  style={{ borderColor: homeColor + '40', backgroundColor: homeColor + '10' }}
              >
                {channel.home_team.logo_url ? (
                    <img
                        src={channel.home_team.logo_url}
                        alt={channel.home_team.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/team-placeholder.png';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold"
                         style={{ color: homeColor }}>
                      {channel.home_team.name.substring(0, 3)}
                    </div>
                )}
              </div>
              <span className="text-sm font-semibold mb-1">{channel.home_team.name}</span>
              {channel.game_status !== "UPCOMING" && (
                  <span className="text-2xl font-bold">{channel.score_home}</span>
              )}
            </div>

            <div className="flex flex-col items-center justify-center mx-4 text-center">
              <div className="text-xs uppercase font-medium text-gray-400 mb-1">
                {channel.game_status === "LIVE" ? "LIVE" :
                    channel.game_status === "UPCOMING" ? "STARTS" : "FINAL"}
              </div>
              <div className={`text-xs ${channel.game_status === "LIVE" ? "text-red-400" : "text-gray-400"} font-medium mb-2`}>
                {getTimeInfo()}
              </div>
              {channel.game_status === "LIVE" && (
                  <div className="flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-50"></div>
                  </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center text-center w-1/3">
              <div
                  className="w-16 h-16 rounded-full mb-2 p-0.5 border-2"
                  style={{ borderColor: awayColor + '40', backgroundColor: awayColor + '10' }}
              >
                {channel.away_team.logo_url ? (
                    <img
                        src={channel.away_team.logo_url}
                        alt={channel.away_team.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/team-placeholder.png';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold"
                         style={{ color: awayColor }}>
                      {channel.away_team.name.substring(0, 3)}
                    </div>
                )}
              </div>
              <span className="text-sm font-semibold mb-1">{channel.away_team.name}</span>
              {channel.game_status !== "UPCOMING" && (
                  <span className="text-2xl font-bold">{channel.score_away}</span>
              )}
            </div>
          </div>

          {/* Action button */}
          <Link href={`/channels/${channel.slug}`} className="w-full block mt-5">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all">
              {channel.game_status === "LIVE" ? "JOIN LIVE CHAT" :
                  channel.game_status === "UPCOMING" ? "SET REMINDER" : "VIEW RECAP"}
            </Button>
          </Link>

          {/* Game details */}
          <div className="flex justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-700/50">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{channel.active_users_count} fans</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[120px]">{channel.venue}</span>
            </div>
          </div>
        </div>
      </div>
  );
}

function ChannelSkeleton() {
  return (
      <div className="bg-[#1e1e45]/70 backdrop-blur-sm rounded-xl p-5 text-white border border-white/5 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-700 rounded-full mr-2"></div>
            <div className="h-4 w-20 bg-gray-700 rounded"></div>
          </div>
          <div className="h-5 w-16 bg-gray-700 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center py-4">
          <div className="flex flex-col items-center w-1/3">
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-2"></div>
            <div className="h-4 w-16 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 w-8 bg-gray-700 rounded"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-3 w-12 bg-gray-700 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-700 rounded"></div>
          </div>

          <div className="flex flex-col items-center w-1/3">
            <div className="w-16 h-16 bg-gray-700 rounded-full mb-2"></div>
            <div className="h-4 w-16 bg-gray-700 rounded mb-2"></div>
            <div className="h-6 w-8 bg-gray-700 rounded"></div>
          </div>
        </div>

        <div className="h-10 w-full bg-gray-700 rounded-lg mt-5"></div>

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-700/50">
          <div className="h-3 w-16 bg-gray-700 rounded"></div>
          <div className="h-3 w-24 bg-gray-700 rounded"></div>
        </div>
      </div>
  );
}