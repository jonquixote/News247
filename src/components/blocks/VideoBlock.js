import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '../ui/card';

const VideoBlock = React.memo(({ src, title }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const handleVideoError = useCallback((e) => {
    const videoElement = e.target;
    const error = videoElement.error;
    console.error('Video Error:', error);
    setError(`Video Error: ${error.message} (Code: ${error.code})`);
  }, []);

  const loadVideo = useCallback(async () => {
    setError(null);
    setIsLoaded(false);

    try {
      console.log("Attempting to fetch video from:", src);
      const response = await fetch(src);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoSrc(url);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading video:', error);
      setError(`Failed to load video. Error: ${error.message}`);
    }
  }, [src]);

  useEffect(() => {
    loadVideo();

    return () => {
      if (videoSrc) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [src, loadVideo, videoSrc]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('error', handleVideoError);
      videoElement.addEventListener('loadedmetadata', () => setIsLoaded(true));
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener('error', handleVideoError);
        videoElement.removeEventListener('loadedmetadata', () => setIsLoaded(true));
      }
    };
  }, [handleVideoError]);

  return (
    <Card className="w-full overflow-hidden">
      <div ref={containerRef} className="relative">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : isLoaded && videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            className="w-full"
            controls
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Loading video...</span>
          </div>
        )}
      </div>
    </Card>
  );
});

export default VideoBlock;