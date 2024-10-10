import React from 'react';

const VideoLoader = () => {
  return (
    <div className="video-loader-container">
      <svg className="video-loader" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Rotating Ring */}
        <circle
          className="loader-ring"
          cx="50"
          cy="50"
          r="45"
          strokeWidth="5"
          stroke="#3498db"
          fill="none"
        />
        {/* Pulsating Dots */}
        <g className="loader-dots">
          <circle className="dot dot1" cx="50" cy="15" r="5" fill="#3498db" />
          <circle className="dot dot2" cx="85" cy="50" r="5" fill="#3498db" />
          <circle className="dot dot3" cx="50" cy="85" r="5" fill="#3498db" />
          <circle className="dot dot4" cx="15" cy="50" r="5" fill="#3498db" />
        </g>
        {/* Central Play Icon */}
        <path
          className="loader-play-icon"
          d="M40,35 L70,50 L40,65 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
};

export default VideoLoader;