import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';

const VideoBlock = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("VideoBlock received src:", src); // Debugging log
  }, [src]);

  const isValidVideoSource = (source) => {
    return source && (
      (typeof source === 'string' && (source.startsWith('http') || source.startsWith('blob:') || source.startsWith('data:video'))) ||
      source instanceof File
    );
  };

  const videoSrc = isValidVideoSource(src) ? (src instanceof File ? URL.createObjectURL(src) : src) : null;

  console.log("Rendered video source:", videoSrc); // Debugging log

  if (!videoSrc) {
    return <div>No valid video source provided.</div>;
  }

  // ... rest of the component (playVideo, pauseVideo, etc.) ...

  return (
    <Card className="overflow-hidden relative" ref={containerRef}>
      <div className="relative">
        {title && (
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <video
            ref={videoRef}
            className={`w-full h-auto ${isFullscreen ? '' : 'object-cover'}`}
            src={videoSrc}
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={() => {
              videoRef.current.currentTime = 0;
              setIsLoaded(true);
            }}
            style={{ display: isLoaded ? 'block' : 'none' }}
            onClick={isFullscreen ? undefined : () => isPlaying ? pauseVideo() : playVideo()}
            controls={isFullscreen}
          >
            Your browser does not support the video tag.
          </video>
        )}
        {/* ... controls for play, pause, fullscreen, etc. ... */}
      </div>
    </Card>
  );
};

export default VideoBlock;