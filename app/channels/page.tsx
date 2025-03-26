"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChannelsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirigir a la página feed
    router.push("/feed");
  }, [router]);
  
  return (
    <div className="h-screen w-screen bg-[#232341] flex flex-col items-center justify-center text-white">
      <div className="animate-pulse text-2xl">Redirigiendo a canales...</div>
    </div>
  );
}