import { NextRequest } from "next/server";
import { getAccessToken } from "../../../lib/spotify"

export async function GET(req: NextRequest) {
  try {
    const access_token = await getAccessToken();

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (response.status === 204 || response.status > 400) {
      return Response.json({ isPlaying: false });
    }

    const song = await response.json();

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artists = song.item.artists.map((artist) => ({
      name: artist.name,
      url: artist.external_urls.spotify,
    }));
    const album = song.item.album.name;
    const albumArtists = song.item.album.artists
      .map((artist) => artist.name)
      .join(", ");
    const albumUrl = song.item.album.external_urls.spotify;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;
    const progress = song.progress_ms;
    const duration = song.item.duration_ms;

    return Response.json({
      isPlaying,
      title,
      artists,
      album,
      albumArtists,
      albumUrl,
      albumImageUrl,
      songUrl,
      progress,
      duration,
    });
  } catch (error) {
    console.error("Error in /api/now-playing:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
