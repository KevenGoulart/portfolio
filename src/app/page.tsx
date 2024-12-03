'use client'

import SpotifyStatus from "@/components/spotify-status";

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-3xl mt-10">Keven Goulart</h1>
      <div className="flex justify-center">
        <SpotifyStatus />
      </div>
    </div>
  );
}
