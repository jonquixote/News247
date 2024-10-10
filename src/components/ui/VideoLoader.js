import React from 'react';

const VideoLoader = () => {
  return (
    <div className="video-loader-container">
      <svg className="video-loader" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle className="loader-circle" cx="50" cy="50" r="45" />
        <g className="loader-film-strip">
          <rect x="35" y="10" width="30" height="80" rx="5" ry="5" />
          <circle className="loader-sprocket" cx="50" cy="20" r="4" />
          <circle className="loader-sprocket" cx="50" cy="35" r="4" />
          <circle className="loader-sprocket" cx="50" cy="50" r="4" />
          <circle className="loader-sprocket" cx="50" cy="65" r="4" />
          <circle className="loader-sprocket" cx="50" cy="80" r="4" />
        </g>
        <path className="loader-play" d="M40,35 L65,50 L40,65 Z" />
      </svg>
    </div>
  );
};

export default VideoLoader;