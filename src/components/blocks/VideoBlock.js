import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import VideoLoader from '../ui/VideoLoader';

const VideoBlock = ({ src, title, poster }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Implement Lazy Loading using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // Start loading 200px before the video enters the viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Video Source Preparation with Multiple Formats
  const videoSources = [
    { src: src, type: 'video/mp4' },
    { src: src.replace(/\.mp4$/, '.webm'), type: 'video/webm' },
    { src: src.replace(/\.mp4$/, '.ogg'), type: 'video/ogg' },
    { src: src.replace(/\.mp4$/, '.mov'), type: 'video/quicktime' },
    { src: src.replace(/\.mp4$/, '.flv'), type: 'video/x-flv' },
  ];

  // Plyr Configuration
  const plyrOptions = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
    autoplay: false,
    muted: isMuted,
    poster: poster || '',
    disableContextMenu: true,
  };

  // Handle Plyr Events
  const handlePlyrError = (event) => {
    console.error("Plyr error:", event);
    setError("Error loading video. Please try a different format or URL.");
    setIsLoaded(false);
  };

  const handlePlyrReady = () => {
    setIsLoaded(true);
    setError(null);
  };

  return (
    <Card className="overflow-hidden relative video-card" ref={containerRef} style={{ aspectRatio: '16/9' }}>
      <div className="relative w-full h-full">
        {title && (
          <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-center h-full" role="alert">
            <strong className="font-bold mr-2">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : isVisible ? (
          <>
            <Plyr
              type="video"
              sources={videoSources}
              options={plyrOptions}
              onError={handlePlyrError}
              onReady={handlePlyrReady}
              ref={videoRef}
              className="w-full h-full object-cover"
            />
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <VideoLoader />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <VideoLoader />
          </div>
        )}
      </div>
      {title && <p className="mt-2 text-center text-gray-600">{title}</p>}
    </Card>
  );
};

export default VideoBlock;