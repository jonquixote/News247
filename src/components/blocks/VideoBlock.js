import React from 'react';

const VideoBlock = ({ src, title }) => {
  console.log("VideoBlock received src:", src); // Debugging log

  if (!src) {
    return <div>No video source provided.</div>;
  }

  // Check if the src is a Blob URL (for local preview) or a string (for remote URL)
  const isLocalFile = src.startsWith('blob:') || src.startsWith('data:');

  return (
    <div>
      {title && <h3>{title}</h3>}
      {isLocalFile ? (
        <video controls width="300" src={src}>
          Your browser does not support the video tag.
        </video>
      ) : (
        <video controls width="300">
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
};

export default VideoBlock;