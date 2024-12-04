'use client'

import useSWR from "swr";
import { useState, useEffect } from "react";
import {
  formatDistanceToNowStrict,
  parseISO,
  differenceInSeconds,
} from "date-fns";
import Link from "next/link";
import Image from "next/image";

const fetcher = (url:string) => fetch(url).then((r) => r.json());

const SpotifyStatus = () => {
  const {
    data: nowPlaying,
    mutate: mutateNowPlaying,
  } = useSWR(
    "/api/now-playing",
    fetcher,
    { refreshInterval: 5000 }
  );
  const { data: recentlyPlayed } = useSWR(
    "/api/recently-played",
    fetcher,
    { refreshInterval: 60000 }
  );
  const [progress, setProgress] = useState(0);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (nowPlaying) {
      setProgress(nowPlaying.progress);

      if (nowPlaying.isPlaying) {
        const timer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= nowPlaying.duration) {
              clearInterval(timer);
              mutateNowPlaying();
              return nowPlaying.duration;
            }
            return prev + 1000;
          });
        }, 1000);
        return () => clearInterval(timer);
      }
    }
  }, [nowPlaying, mutateNowPlaying]);

  useEffect(() => {
    if (recentlyPlayed && !recentlyPlayed.error) {
      const playedAt = parseISO(recentlyPlayed.played_at);

      const updateTimeAgo = () => {
        const now = new Date();
        const secondsAgo = differenceInSeconds(now, playedAt);

        if (secondsAgo < 60) {
          setTimeAgo(`${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`);
          return true;
        } else {
          setTimeAgo(formatDistanceToNowStrict(playedAt, { addSuffix: true }));
          return false;
        }
      };

      let isWithinFirstMinute = updateTimeAgo();

      const timer = setInterval(() => {
        isWithinFirstMinute = updateTimeAgo();

        if (!isWithinFirstMinute) {
          clearInterval(timer);
          setInterval(updateTimeAgo, 60000);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [recentlyPlayed]);

  if (!nowPlaying || !recentlyPlayed) return <div>Loading...</div>;

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getStatusAndTrack = () => {
    if (nowPlaying.isPlaying) {
      return {
        status: "Ouvindo agora",
        track: nowPlaying,
        progressText: `${formatTime(progress)} / ${formatTime(
          nowPlaying.duration
        )}`,
      };
    } else if (nowPlaying.title) {
      return {
        status: "Pausado",
        track: nowPlaying,
        progressText: `${formatTime(progress)} / ${formatTime(
          nowPlaying.duration
        )}`,
      };
    } else if (recentlyPlayed && !recentlyPlayed.error) {
      return {
        status: "Offline",
        track: recentlyPlayed,
        progressText: `Played ${timeAgo}`,
      };
    } else {
      return {
        status: "Offline",
        track: null,
        progressText: "No recent tracks",
      };
    }
  };

  const { status, track, progressText } = getStatusAndTrack();

  return (
    <div>
      <h2>{status}</h2>
      {track && (
        <>
          <a href={track.albumUrl} target="_blank" rel="noopener noreferrer">
            <Image
              width={600}
              height={800}
              src={track.albumImageUrl}
              alt={`${track.album} by ${track.albumArtists}`}
            />
          </a>
          <div>
              <Link href={track.songUrl} target="_blank" rel="noopener noreferrer">
              {track.title}
              </Link>{" "}
              by{" "}
            {track.artists.map((artist, index) => (
              <Link key={artist.name} href={artist.url} target="_blank" rel="noopener noreferrer">
              {index > 0 && ", "}{artist.name}
              </Link>
            ))}
          </div>
        </>
      )}
      <p>{progressText}</p>
    </div>
  );
};

export default SpotifyStatus;
