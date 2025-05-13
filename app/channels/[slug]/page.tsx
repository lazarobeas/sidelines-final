"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, LogIn, Users, X, MessageSquare, ListChecks } from "lucide-react";
import Chat from "@/components/Chat"; // Your existing Chat component

// --- Type definitions (Message, Highlight, Channel, Params) remain the same ---
type Message = { id: number; message: string; inserted_at: string; user_id: string; channel_id: number; is_pinned: boolean; user: { username: string; display_name?: string; avatar_url?: string; }; };
type Highlight = { id: number; title: string; description: string; game_time: string; highlight_type: string; inserted_at: string; team_id: number; media_url?: string; team?: { name: string; logo_url?: string; primary_color: string; }; };
type Channel = { id: number; slug: string; home_team_id: number; away_team_id: number; league_id: number; game_date: string; game_status: "UPCOMING" | "LIVE" | "COMPLETED"; score_home: number; score_away: number; game_period: string; time_remaining: string; venue: string; inserted_at: string; home_team: { id: number; name: string; slug: string; logo_url?: string; primary_color: string; secondary_color: string; }; away_team: { id: number; name: string; slug: string; logo_url?: string; primary_color: string; secondary_color: string; }; league: { id: number; name: string; slug: string; logo_url?: string; }; };
type Params = { slug: string; };


function HighlightCard({ highlight }: { highlight: Highlight }) {
  return (
      <div className="border-b border-blue-900/30 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0 bg-[#181830]/30 p-3 rounded-lg">
        <div className="flex items-start mb-2">
          {highlight.team ? (
              <div
                  className="w-10 h-10 rounded-full mr-2.5 flex-shrink-0 flex items-center justify-center p-0.5 border border-white/10"
                  style={{ backgroundColor: `${highlight.team.primary_color}33` }}
              >
                <img
                    src={highlight.team.logo_url || "/team-placeholder.png"}
                    alt={highlight.team.name}
                    className="w-full h-full object-contain"
                />
              </div>
          ) : (
              <div className="w-10 h-10 bg-gray-700 rounded-full mr-2.5 flex-shrink-0"></div>
          )}
          <div className="flex-grow min-w-0">
            <div className="text-white text-sm sm:text-base font-semibold leading-tight">
              {highlight.game_time && <span className="text-indigo-300 mr-1.5">{highlight.game_time}</span>}
              {highlight.title.toUpperCase()}
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mt-0.5 break-words">
              {highlight.description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs">
          <Badge className="bg-indigo-500/80 text-white px-2 py-0.5 text-[10px] sm:text-xs">
            {highlight.highlight_type}
          </Badge>
          <span className="text-gray-400">
          {formatDistanceToNow(new Date(highlight.inserted_at), { addSuffix: true })}
        </span>
        </div>
        {highlight.media_url && (
            <div className="mt-2.5 rounded-md overflow-hidden">
              <img src={highlight.media_url} alt={highlight.title} className="w-full h-auto object-cover"/>
            </div>
        )}
      </div>
  );
}

function PlayByPlayColumn({ highlights }: { highlights: Highlight[] }) {
  return (
      <div className="bg-[#1c1c3a] p-3 md:p-4 rounded-lg flex flex-col h-full min-h-0 overflow-hidden shadow-xl border border-blue-900/30">
        <h2 className="text-white text-base sm:text-lg font-semibold mb-3 flex-shrink-0 border-b border-blue-900/50 pb-2.5">
          Play-by-Play
        </h2>
        {highlights.length > 0 ? (
            <div className="space-y-2.5 overflow-y-auto flex-grow min-h-0 pr-1 custom-scrollbar"> {/* Added min-h-0 */}
              {highlights.map((highlight) => (
                  <HighlightCard key={highlight.id} highlight={highlight} />
              ))}
            </div>
        ) : (
            <div className="text-center py-8 text-gray-400 flex-grow flex flex-col items-center justify-center">
              <ListChecks className="w-10 h-10 mb-3 text-gray-500" />
              <p className="text-sm">No highlights posted yet.</p>
            </div>
        )}
      </div>
  );
}

export default function ChannelPage() {
  const params = useParams<Params>();
  const slug = params.slug;
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'chat' | 'highlights'>('chat');
  const router = useRouter();
  const supabase = createClient();

  // useEffect for fetching initial data
  useEffect(() => {
    if (!slug) return;
    async function fetchChannelData() {
      setLoading(true);
      try {
        const { data: channelData, error: channelError } = await supabase
            .from("channels")
            .select("*, home_team:home_team_id(*), away_team:away_team_id(*), league:league_id(*)")
            .eq("slug", slug)
            .single();
        if (channelError) throw channelError;
        setChannel(channelData);

        if (channelData) { // Fetch messages & highlights only if channel exists
          const { data: messagesData, error: messagesError } = await supabase
              .from("messages").select("*, user:user_id(username, display_name, avatar_url)")
              .eq("channel_id", channelData.id).order("inserted_at", { ascending: true });
          if (messagesError) throw messagesError;
          setMessages(messagesData || []);

          const { data: highlightsData, error: highlightsError } = await supabase
              .from("highlights").select("*, team:team_id(name, logo_url, primary_color)")
              .eq("channel_id", channelData.id).order("inserted_at", { ascending: false });
          if (highlightsError) throw highlightsError;
          setHighlights(highlightsData || []);
        }
        setActiveUsers(Math.floor(Math.random() * 120) + 5);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setChannel(null);
      } finally {
        setLoading(false);
      }
    }
    fetchChannelData();
  }, [slug, supabase]);

  // useEffect for Realtime Subscriptions (separated for clarity)
  useEffect(() => {
    if (!channel?.id || !slug) return; // Ensure channel.id is available

    const commonFilter = `channel_id=eq.${channel.id}`;

    const messagesSubscription = supabase
        .channel(`messages_channel_${channel.id}`) // Unique channel name per channel ID
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: commonFilter },
            async (payload) => {
              const { data: userData } = await supabase.from("users").select("username, display_name, avatar_url").eq("id", payload.new.user_id).single();
              const newMsg: Message = { ...(payload.new as Omit<Message, 'user'>), user: userData || { username: "Anonymous" } };
              setMessages((currentMessages) => [...currentMessages, newMsg]);
            }
        ).subscribe();

    const highlightsSubscription = supabase
        .channel(`highlights_channel_${channel.id}`) // Unique channel name
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "highlights", filter: commonFilter },
            async (payload) => {
              let teamData: any;
              if (payload.new.team_id) {
                ({ data: teamData } = await supabase.from("teams").select("name, logo_url, primary_color").eq("id", payload.new.team_id).single());
              }
              setHighlights((currentHighlights) => [{ ...(payload.new as Omit<Highlight, 'team'>), team: teamData ?? undefined }, ...currentHighlights]);
            }
        ).subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
      supabase.removeChannel(highlightsSubscription);
    };
  }, [channel?.id, slug, supabase]); // Depend on channel.id

  const handleSendMessage = async (e: React.FormEvent) => { /* ... (keep existing logic) ... */ e.preventDefault(); if (!newMessage.trim() || !channel) return; try { const { data: { user } } = await supabase.auth.getUser(); if (!user) { setShowAuthModal(true); return; } await supabase.from("messages").insert({ message: newMessage, channel_id: channel.id, user_id: user.id, }); setNewMessage(""); } catch (error) { console.error("Error sending message:", error); } };

  if (loading) { return <div className="h-screen w-screen bg-[#232341] flex flex-col items-center justify-center text-white"><div className="animate-pulse text-2xl">Loading Channel...</div></div>; }
  if (!channel) { return <div className="h-screen w-screen bg-[#232341] flex flex-col items-center justify-center text-white"><div className="text-2xl mb-4">Channel Not Found</div><Link href="/feed"><Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg px-6 py-2">Back to Feed</Button></Link></div>; }

  return (
      <div className="h-screen w-screen bg-[#232341] flex flex-col overflow-hidden">
        {showAuthModal && ( /* ... Auth Modal ... */ <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"> <div className="bg-[#1e2142] rounded-lg p-6 max-w-md w-full text-white relative shadow-2xl border border-blue-900/50"> <button onClick={() => setShowAuthModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"> <X size={20} /> </button> <div className="text-center mb-6"> <LogIn className="mx-auto h-10 w-10 text-indigo-400 mb-3" /> <h2 className="text-xl font-semibold mb-1">Sign in to Chat</h2> <p className="text-sm text-gray-300"> Join the conversation by signing in or creating an account. </p> </div> <div className="flex flex-col gap-3"> <Button onClick={() => router.push('/login')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md"> Sign In </Button> <Button onClick={() => router.push('/login?register=true')} variant="outline" className="w-full border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 font-semibold py-2.5 rounded-md"> Create Account </Button> </div> </div> </div> )}
        <header className="bg-[#1a1a33]/80 backdrop-blur-sm p-3 md:p-4 shadow-md flex-shrink-0 border-b border-blue-900/30 z-10"> {/* ... Header Content ... */ <div className="max-w-7xl mx-auto flex justify-between items-center"> <div className="flex items-center min-w-0"> <Link href="/feed" className="mr-2 md:mr-3 text-gray-300 hover:text-white transition-colors"> <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" /> </Link> <div className="flex items-center overflow-hidden mr-2"> <div className="w-6 h-6 md:w-7 md:h-7 rounded-full mr-1.5 md:mr-2 flex-shrink-0 flex items-center justify-center p-0.5 border border-white/10" style={{ backgroundColor: `${channel.home_team.primary_color}4D` }} > <img src={channel.home_team.logo_url || "/team-placeholder.png"} alt={channel.home_team.name} className="w-full h-full object-contain"/> </div> <div className="text-xs sm:text-sm md:text-base text-white font-semibold truncate" title={`${channel.home_team.name} vs ${channel.away_team.name}`}> <span className="hidden sm:inline">{channel.home_team.name}</span> <span className="sm:hidden">{channel.home_team.name.substring(0,3).toUpperCase()}</span> <span className="mx-1">vs</span> <span className="hidden sm:inline">{channel.away_team.name}</span> <span className="sm:hidden">{channel.away_team.name.substring(0,3).toUpperCase()}</span> </div> <div className="w-6 h-6 md:w-7 md:h-7 rounded-full ml-1.5 md:ml-2 flex-shrink-0 flex items-center justify-center p-0.5 border border-white/10" style={{ backgroundColor: `${channel.away_team.primary_color}4D` }} > <img src={channel.away_team.logo_url || "/team-placeholder.png"} alt={channel.away_team.name} className="w-full h-full object-contain"/> </div> </div> </div> <div className="flex items-center flex-shrink-0"> <Badge className={`text-[10px] sm:text-xs px-2 py-0.5 md:px-2.5 md:py-1 mr-2 md:mr-3 rounded-full border border-transparent ${channel.game_status === "LIVE" ? "bg-red-500/90 text-white border-red-400/50" : channel.game_status === "UPCOMING" ? "bg-blue-500/90 text-white border-blue-400/50" : "bg-gray-500/90 text-white border-gray-400/50" } `}> {channel.game_status === "LIVE" && ( <span className="mr-1 relative flex h-1.5 w-1.5 md:h-2 md:w-2"> <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75 opacity-75"></span> <span className="relative inline-flex rounded-full h-full w-full bg-white"></span> </span> )} {channel.game_status} </Badge> {channel.game_status !== "UPCOMING" && ( <div className="text-white font-bold text-xs sm:text-sm md:text-base mr-2 md:mr-3 hidden xs:block"> {channel.score_home}-{channel.score_away} </div> )} <div className="text-gray-300 flex items-center text-[10px] sm:text-xs md:text-sm"> <Users className="h-3 w-3 md:h-4 md:w-4 mr-1" /> <span>{activeUsers}</span> <span className="hidden xs:inline ml-0.5 md:ml-1">fans</span> </div> </div> </div> }</header>

        <div className="md:hidden bg-[#1c1c3a] border-b border-blue-900/50 p-1.5 flex-shrink-0 sticky top-[var(--header-height,60px)] z-[5]"> {/* Adjust CSS var --header-height or value */}
          <div className="flex justify-around items-center rounded-md bg-[#13132c] p-0.5">
            <Button variant="ghost" onClick={() => setActiveMobileTab('chat')} className={`flex-1 py-1.5 px-2.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center ${activeMobileTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-[#2a2a50]/70 hover:text-white'}`}> <MessageSquare size={14} className="mr-1.5 sm:mr-2" /> Chat </Button>
            <Button variant="ghost" onClick={() => setActiveMobileTab('highlights')} className={`flex-1 py-1.5 px-2.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center ${activeMobileTab === 'highlights' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-[#2a2a50]/70 hover:text-white'}`}> <ListChecks size={14} className="mr-1.5 sm:mr-2" /> Highlights </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-grow flex flex-col min-h-0 md:flex-row md:overflow-hidden p-2 md:p-3 gap-2 md:gap-3">
          {/* Mobile View */}
          <div className={`w-full h-full min-h-0 ${activeMobileTab === 'highlights' ? 'block' : 'hidden'} md:hidden`}>
            <PlayByPlayColumn highlights={highlights} />
          </div>
          <div className={`w-full h-full min-h-0 ${activeMobileTab === 'chat' ? 'block' : 'hidden'} md:hidden`}>
            <Chat messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
          </div>

          {/* Desktop View */}
          <div className="hidden md:flex md:w-2/5 h-full min-h-0">
            <PlayByPlayColumn highlights={highlights} />
          </div>
          <div className="hidden md:flex md:w-3/5 h-full min-h-0">
            <Chat messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
  );
}