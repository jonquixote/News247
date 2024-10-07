import React, { useState, useRef, useEffect } from 'react';
import { Card } from './card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoCard = ({ title, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('error', (e) => {
        console.error("Video error:", e);
        setError("Error loading video. Please check the video source.");
      });
      video.addEventListener('loadeddata', () => {
        setIsLoaded(true);
      });
    }
    return () => {
      if (video) {
        video.removeEventListener('error', () => {});
        video.removeEventListener('loadeddata', () => {});
      }
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !videoRef.current.muted;
  };

  return (
    <Card className="overflow-hidden relative h-full">
      <div className="relative h-full">
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              poster="/api/placeholder/640/360"
              onLoadedMetadata={() => {
                videoRef.current.currentTime = 0;
              }}
              style={{ display: isLoaded ? 'block' : 'none' }}
            >
              Your browser does not support the video tag.
            </video>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading video...</span>
              </div>
            )}
            {!isPlaying && isLoaded && (
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition-all"
                onClick={togglePlay}
              >
                <Play className="h-12 w-12" />
              </button>
            )}
            {isPlaying && isLoaded && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                <button
                  className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  onClick={togglePlay}
                >
                  <Pause className="h-6 w-6" />
                </button>
                <button
                  className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-6 w-6" />
                  ) : (
                    <Volume2 className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default VideoCard;