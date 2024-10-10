import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const VideoBlock = ({ src, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("Video source:", src); // Debugging log
    const video = videoRef.current;
    if (video) {
      const handleError = (e) => {
        console.error("Video error:", e);
        console.error("Video error details:", e.target.error);
        let errorMessage = "Error loading video. Please check the video source.";
        if (e.target.error && e.target.error.code) {
          switch (e.target.error.code) {
            case 1:
              errorMessage = "The video loading was aborted.";
              break;
            case 2:
              errorMessage = "Network error occurred while loading the video.";
              break;
            case 3:
              errorMessage = "Error decoding video. The file might be corrupted or use an unsupported format.";
              break;
            case 4:
              errorMessage = "The video is not supported by your browser.";
              break;
            default:
              errorMessage = "An unknown error occurred while loading the video.";
              break;
          }
        }
        setError(errorMessage);
        setIsLoaded(false);
      };
      const handleLoaded = () => {
        console.log("Video loaded successfully"); // Debugging log
        setIsLoaded(true);
        setError(null);
      };
      
      video.addEventListener('error', handleError);
      video.addEventListener('loadeddata', handleLoaded);
      
      return () => {
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadeddata', handleLoaded);
      };
    }
  }, [src]);

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
    return string && (
      string.startsWith('http') ||
      string.startsWith('data:video') ||
      string.startsWith('blob:') ||
      /\.(mp4|webm|ogg)$/i.test(string)
    );
  };

  // Determine the video source
  const videoSrc = isValidVideoSource(src) ? src : null;

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
              <source src={videoSrc} type="video/mp4" />
              <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
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
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">No valid video source provided. Please check the video URL.</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoBlock;