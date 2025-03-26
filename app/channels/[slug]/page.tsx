"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, Send, Users } from "lucide-react";

type Message = {
  id: number;
  message: string;
  inserted_at: string;
  user_id: string;
  channel_id: number;
  is_pinned: boolean;
  user: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
};

type Highlight = {
  id: number;
  title: string;
  description: string;
  game_time: string;
  highlight_type: string;
  inserted_at: string;
  team_id: number;
  media_url?: string;
  team?: {
    name: string;
    logo_url?: string;
    primary_color: string;
  };
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
  home_team: {
    id: number;
    name: string;
    slug: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
  };
  away_team: {
    id: number;
    name: string;
    slug: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
  };
  league: {
    id: number;
    name: string;
    slug: string;
    logo_url?: string;
  };
};

// Definir explícitamente el tipo para los parámetros de la URL
type Params = {
  slug: string;
};

export default function ChannelPage() {
  // Tipado explícito para useParams
  const params = useParams<Params>();
  const slug = params.slug;
  
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!slug) return;

    async function fetchChannelData() {
      try {
        // Fetch channel data
        const { data: channelData, error: channelError } = await supabase
          .from("channels")
          .select(`
            *,
            home_team:home_team_id(*),
            away_team:away_team_id(*),
            league:league_id(*)
          `)
          .eq("slug", slug)
          .single();

        if (channelError) throw channelError;
        setChannel(channelData);

        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select(`
            *,
            user:user_id(username, display_name, avatar_url)
          `)
          .eq("channel_id", channelData.id)
          .order("inserted_at", { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData);

        // Fetch highlights
        const { data: highlightsData, error: highlightsError } = await supabase
          .from("highlights")
          .select(`
            *,
            team:team_id(name, logo_url, primary_color)
          `)
          .eq("channel_id", channelData.id)
          .order("inserted_at", { ascending: false });

        if (highlightsError) throw highlightsError;
        setHighlights(highlightsData);

        // Set random active users for demo purposes
        setActiveUsers(Math.floor(Math.random() * 120) + 5);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchChannelData();

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel(`messages:${slug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channel?.id}`,
        },
        async (payload) => {
          // Fetch the user data for the new message
          const { data: userData } = await supabase
            .from("users")
            .select("username, display_name, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          const newMsg: Message = {
            ...payload.new as Message,
            user: userData || { username: "Anonymous" },
          };

          setMessages((current) => [...current, newMsg]);
        }
      )
      .subscribe();

    // Subscribe to new highlights
    const highlightsSubscription = supabase
      .channel(`highlights:${slug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "highlights",
          filter: `channel_id=eq.${channel?.id}`,
        },
        async (payload) => {
          // Get team data if exists
          if (payload.new.team_id) {
            const { data: teamData } = await supabase
              .from("teams")
              .select("name, logo_url, primary_color")
              .eq("id", payload.new.team_id)
              .single();
              
        setHighlights((current) => [
        { ...payload.new as Highlight, team: teamData ?? undefined },
        ...current,
        ]);
          } else {
            setHighlights((current) => [{ ...payload.new as Highlight }, ...current]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(highlightsSubscription);
    };
  }, [slug, supabase, channel?.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channel) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user || !user.user) {
        // Handle not logged in state
        alert("Por favor inicia sesión para enviar mensajes");
        return;
      }

      const { error } = await supabase.from("messages").insert({
        message: newMessage,
        channel_id: channel.id,
        user_id: user.user.id,
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#232341] flex flex-col items-center justify-center text-white">
        <div className="animate-pulse text-2xl">Cargando canal...</div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-screen w-screen bg-[#232341] flex flex-col items-center justify-center text-white">
        <div className="text-2xl mb-4">Canal no encontrado</div>
        <Link href="/feed">
          <Button className="bg-white text-black font-bold rounded-full">
            Volver a canales
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#232341] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-[#1a1a33] p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/feed" className="mr-4">
              <ChevronLeft className="h-6 w-6 text-white" />
            </Link>
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-full mr-2 flex items-center justify-center"
                style={{ backgroundColor: channel.home_team.primary_color }}
              >
                <img
                  src={channel.home_team.logo_url || "/team-placeholder.png"}
                  alt={channel.home_team.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div className="text-lg text-white font-bold">
                {channel.home_team.name} vs {channel.away_team.name}
              </div>
              <div 
                className="w-8 h-8 rounded-full ml-2 flex items-center justify-center"
                style={{ backgroundColor: channel.away_team.primary_color }}
              >
                <img
                  src={channel.away_team.logo_url || "/team-placeholder.png"}
                  alt={channel.away_team.name}
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Badge className={`
              px-3 py-1 mr-3 rounded-full 
              ${channel.game_status === "LIVE" ? 
                "bg-red-600 text-white" : 
                channel.game_status === "UPCOMING" ? 
                  "bg-blue-600 text-white" : 
                  "bg-gray-600 text-white"
              }
            `}>
              {channel.game_status === "LIVE" && (
                <span className="mr-1 relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
              {channel.game_status}
            </Badge>
            
            {channel.game_status !== "UPCOMING" && (
              <div className="text-white font-bold mr-4">
                {channel.score_home} - {channel.score_away}
              </div>
            )}
            
            <div className="text-gray-300 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{activeUsers} fans</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden p-4">
        {/* Play-by-play column (highlights) */}
        <div className="w-full md:w-2/5 bg-[#1e2142] p-4 rounded-lg overflow-auto mb-4 md:mb-0 md:mr-4">
          <h2 className="text-white text-xl font-bold mb-4">Play-by-Play</h2>
          
          {highlights.length > 0 ? (
            <div className="space-y-4">
              {highlights.map((highlight) => (
                <HighlightCard key={highlight.id} highlight={highlight} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No hay jugadas destacadas todavía
            </div>
          )}
        </div>

        {/* Chat column */}
        <div className="w-full md:w-3/5 bg-[#1e2142] rounded-lg flex flex-col overflow-hidden">
          {/* Messages area */}
          <div className="flex-grow p-4 overflow-y-auto">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 h-full flex items-center justify-center">
                Sé el primero en enviar un mensaje
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="p-4 bg-[#1a1a33]">
            <form onSubmit={handleSendMessage} className="flex">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type Message"
                className="flex-grow mr-2 bg-white text-black text-lg rounded-full p-6"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-white text-black rounded-full hover:bg-gray-200 p-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div className="flex items-start">
      <div 
        className="w-8 h-8 rounded-full flex-shrink-0 mr-3 bg-blue-500 flex items-center justify-center text-white font-bold"
      >
        {message.user?.display_name?.charAt(0) || 
          message.user?.username?.charAt(0) || 
          'A'}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-baseline">
          <span className="font-bold text-white mr-2">
            {message.user?.display_name || message.user?.username || 'Anónimo'}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(message.inserted_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-gray-200 break-words">{message.message}</p>
      </div>
    </div>
  );
}

function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
    <div className="border-b border-blue-900 pb-4 mb-4">
      <div className="flex items-center mb-2">
        {highlight.team ? (
          <div 
            className="w-12 h-12 rounded-full mr-3 flex items-center justify-center"
            style={{ backgroundColor: highlight.team.primary_color || '#4F46E5' }}
          >
            <img
              src={highlight.team.logo_url || "/team-placeholder.png"}
              alt={highlight.team.name}
              className="w-10 h-10 object-contain"
            />
          </div>
        ) : (
          <div className="w-12 h-12 bg-gray-700 rounded-full mr-3"></div>
        )}
        
        <div>
          <div className="text-white text-xl font-bold">
            {highlight.game_time} {highlight.title.toUpperCase()}
          </div>
          <div className="text-gray-300 text-sm">
            {highlight.description}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Badge className="bg-indigo-600 text-white mr-2">
            {highlight.highlight_type}
          </Badge>
          <span className="text-gray-300 text-xs">
            {formatDistanceToNow(new Date(highlight.inserted_at), { addSuffix: true })}
          </span>
        </div>
      </div>
      
      {highlight.media_url && (
        <div className="mt-2">
          <img
            src={highlight.media_url}
            alt={highlight.title}
            className="w-full h-auto rounded"
          />
        </div>
      )}
    </div>
  );
}