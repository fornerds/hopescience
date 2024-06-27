import React, { useState, useEffect, useRef } from "react";
import Player from "@vimeo/player";
import "./style.css"

export const VideoPlayer = ({ videoUrl }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) {
      console.error("No video URL provided");
      return;
    }

    const videoId = videoUrl.split('/').pop().split('?')[0];

    const initPlayer = async () => {
      if (!iframeRef.current) return;

      try {
        playerRef.current = new Player(iframeRef.current, {
          id: videoId,
          width: 1150,
          height: 600
        });

        await playerRef.current.ready();

        const videoDuration = await playerRef.current.getDuration();
        setDuration(videoDuration);

        const savedTime = localStorage.getItem("watchedTime");
        if (savedTime) {
          const parsedTime = parseFloat(savedTime);
          // 저장된 시간이 비디오 길이보다 작은 경우에만 설정
          if (parsedTime < videoDuration) {
            await playerRef.current.setCurrentTime(parsedTime);
          } else {
            console.warn("Saved time is greater than video duration. Starting from beginning.");
            localStorage.removeItem("watchedTime");
          }
        }

        const timeUpdateHandler = (data) => {
          setCurrentTime(data.seconds);
          localStorage.setItem("watchedTime", data.seconds.toString());
        };

        playerRef.current.on('timeupdate', timeUpdateHandler);

        playerRef.current.on('error', (error) => {
          console.error("Vimeo player error:", error);
        });

      } catch (error) {
        console.error("Error initializing Vimeo player:", error);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.off('timeupdate');
        playerRef.current.off('error');
        playerRef.current.destroy();
      }
    };
  }, [videoUrl]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!videoUrl) {
    return <div>No video URL provided</div>;
  }

  return (
    <div>
      <div ref={iframeRef}></div>
      <p>Current Time: {formatTime(currentTime)} / {formatTime(duration)}</p>
    </div>
  );
};