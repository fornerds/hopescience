import React from "react";
import "./VideoModal.css";

export const VideoModal = ({ isOpen, videoSrc, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="video-modal">
      <div className="video-modal-content">
        <span className="video-modal-close" onClick={onClose}>
          &times;
        </span>
        <iframe title="Video Content" src={videoSrc} className="video-modal-video" allow="autoplay; fullscreen" allowFullScreen></iframe>
        {/* <video controls autoPlay className="video-modal-video">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      </div>
    </div>
  );
};
