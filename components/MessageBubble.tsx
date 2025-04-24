import React from 'react';
type Message = {
    id: number;
    message: string;
    inserted_at: string;
    user: {
      username: string;
      display_name?: string;
      avatar_url?: string | undefined | null;
    };
  };
  
  export default function MessageBubble({ message }: { message: Message }) {
    return (
      <div className="flex items-start">
        {/* User Avatar */}
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 mr-3 bg-blue-500 flex items-center justify-center text-white font-bold"
        >
          {message.user?.display_name?.charAt(0) ||
            message.user?.username?.charAt(0) ||
            "A"}
        </div>
  
        {/* Message Content */}
        <div className="flex-grow">
          <div className="flex items-baseline">
            <span className="font-bold text-white mr-2">
              {message.user?.display_name || message.user?.username || "Anonymous"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(message.inserted_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-gray-200 break-words">{message.message}</p>
        </div>
      </div>
    );
  }