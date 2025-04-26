// src/app/api/now-playing/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "../../../lib/spotify";

interface SpotifyArtist {
  name: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyAlbum {
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
}

interface SpotifyNowPlaying {
  is_playing: boolean;
  progress_ms: number;
  item: {
    name: string;
    duration_ms: number;
    album: SpotifyAlbum;
    artists: SpotifyArtist[];
    external_urls: { spotify: string };
  } | null;
}

export async function GET(request: Request) {
  try {
    const token = await getAccessToken();
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // se não há nada tocando, devolve uma mensagem de erro em JSON com 200 OK
    if (!res.ok) {
      return NextResponse.json(
        { error: true, message: "Nada tocando" },
        { status: 200 }
      );
    }

    const song: SpotifyNowPlaying = await res.json();

    // caso a propriedade item venha nula
    if (!song.item) {
      return NextResponse.json(
        { error: true, message: "Nada tocando" },
        { status: 200 }
      );
    }

    // mapeia artistas já tipados
    const artists = song.item.artists.map((artist: SpotifyArtist) => ({
      name: artist.name,
      url: artist.external_urls.spotify,
    }));

    return NextResponse.json(
      {
        isPlaying: song.is_playing,
        title: song.item.name,
        albumImageUrl: song.item.album.images[0]?.url,
        albumUrl: song.item.album.external_urls.spotify,
        album: song.item.album.name,
        artists,
        duration: song.item.duration_ms,
        progress: song.progress_ms,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Spotify API error:", err);
    return NextResponse.json(
      { error: true, message: err.message },
      { status: 500 }
    );
  }
}
