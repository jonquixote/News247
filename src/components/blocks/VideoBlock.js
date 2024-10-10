import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const VideoBlock = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const cleanupVideoSrc = useCallback(() => {
    if (videoSrc && videoSrc.startsWith('blob:')) {
      URL.revokeObjectURL(videoSrc);
    }
  }, [videoSrc]);

  useEffect(() => {
    const loadVideo = async () => {
      if (src.startsWith('blob:')) {
        setVideoSrc(src);
      } else {
        try {
          const response = await fetch(src, { 
            mode: 'cors',
            credentials: 'omit'
          });
          if (!response.ok) throw new Error('Failed to fetch video');
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setVideoSrc(url);
          setIsLoaded(true);
        } catch (error) {
          console.error('Error loading video:', error);
          setError('Failed to load video. Please try again later.');
          setVideoSrc(null);
        }
      }
    };

    loadVideo();

    return cleanupVideoSrc;
  }, [src, cleanupVideoSrc]);

  useEffect(() => {
    // Reset error state when src changes
    setError(null);
    setIsLoaded(false);
  }, [src]);

  const playVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => {
        console.error("Error playing video:", e);
        setError("Unable to play video. Please try again.");
      });
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (!videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !videoRef.current.muted;
  };

  const enterFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(document.fullscreenElement ||
           document.webkitFullscreenElement ||
           document.mozFullScreenElement ||
           document.msFullscreenElement)
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Helper function to determine if the src is a valid URL or data URL
  const isValidVideoSource = (string) => {
    return string && (string.startsWith('http') || string.startsWith('data:video'));
  };

  // Use the existing videoSrc state instead of declaring a new constant
  useEffect(() => {
    if (isValidVideoSource(src)) {
      setVideoSrc(src);
    } else {
      setVideoSrc(null);
    }
  }, [src]);

  console.log("Rendered video source:", videoSrc); // Debugging log

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
        ) : videoSrc ? (
          <>
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
              }}
              style={{ display: isLoaded ? 'block' : 'none' }}
              onClick={isFullscreen ? undefined : () => isPlaying ? pauseVideo() : playVideo()}
              controls={isFullscreen}
            >
              Your browser does not support the video tag.
            </video>
            {!isLoaded && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading video...</span>
              </div>
            )}
            {!isPlaying && isLoaded && !isFullscreen && (
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition-all"
                onClick={playVideo}
              >
                <Play className="h-12 w-12" />
              </button>
            )}
            {isLoaded && !isFullscreen && (
              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                {isPlaying ? (
                  <button
                    className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                    onClick={pauseVideo}
                  >
                    <Pause className="h-6 w-6" />
                  </button>
                ) : (
                  <div className="w-10 h-10" />
                )}
                <div className="flex space-x-2">
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
                  <button
                    className="bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                    onClick={enterFullscreen}
                  >
                    <Maximize className="h-6 w-6" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Loading video...</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoBlock;