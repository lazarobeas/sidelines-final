// Imports necessary for component
import React from "react";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";

// Create type called Message that will store multiple values
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

// Create type ChatProps that will store messages
type ChatProps = {
    messages: Message[];
    newMessage: string;
    setNewMessage: (value: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
};

export default function Chat({
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
  }: ChatProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
        <form onSubmit={handleSendMessage} className="flex" data-testid="message-form">
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
            data-testid="send-button"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
