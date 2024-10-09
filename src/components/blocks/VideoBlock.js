import React from 'react';

const VideoBlock = ({ src, title }) => {
  console.log("VideoBlock received src:", src); // Debugging log

  if (!src) {
    return <div>No video source provided.</div>;
  }

  return (
    <div>
      {title && <h3>{title}</h3>}
      <video src={src} controls width="300">
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBlock;