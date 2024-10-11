import React from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';

const VideoBlock = ({ src, title, poster }) => {
  // Ensure the video source is valid
  if (!src) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> Invalid video source</span>
      </div>
    );
  }

  const plyrProps = {
    source: {
      type: 'video',
      sources: [
        {
          src: src,
          type: 'video/mp4',
        },
      ],
    },
    options: {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'fullscreen',
      ],
      poster: poster,
    },
  };

  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}
      <Plyr {...plyrProps} />
    </div>
  );
};

export default VideoBlock;