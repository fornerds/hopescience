import React, { useState, useEffect } from "react";
import "./style.css"

export const VideoPlayer = ({ videoUrl }) => {
  const [watchedTime, setWatchedTime] = useState(0);

  // 이전 시청한 시간을 로컬 스토리지에서 불러옵니다.
  useEffect(() => {
    const savedTime = localStorage.getItem("watchedTime");
    if (savedTime) {
      setWatchedTime(parseInt(savedTime));
    }
  }, []);

  // 페이지를 떠날 때 이전 시청한 시간을 저장합니다.
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("watchedTime", watchedTime.toString());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [watchedTime]);

  // 영상을 재생할 때마다 시간을 업데이트합니다.
  const handleTimeUpdate = (currentTime) => {
    setWatchedTime(currentTime);
  };

  return (
    // <video
    //   controls
    //   onTimeUpdate={(e) => handleTimeUpdate(e.target.currentTime)}
    //   width="1150"
    //   className="video"
    // >
    //   <source src={videoUrl} type="video/mp4" />
    //   비디오 기능을 지원하지 않는 브라우저입니다. 원활한 영상 시청을 위해 Chrome
    //   브라우저를 권장합니다.
    // </video>
    <iframe src={videoUrl} width="1150" className="video" allow="autoplay; fullscreen" allowFullScreen></iframe>
  );
};
