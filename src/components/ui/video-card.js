import React, { useState, useRef, useEffect } from 'react';
import { Card } from './card';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import axios from 'axios';

const VideoCard = ({ title, src, bucket, keyName, file }) => {
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (bucket && keyName) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
            bucket,
            key: keyName
          });
          
          if (response.data && response.data.url) {
            setVideoSrc(response.data.url);
          } else {
            console.error('Failed to generate video URL');
          }
        } catch (err) {
          console.error('Error fetching video URL:', err);
        }
      } else if (file) {
        setVideoSrc(URL.createObjectURL(file));
      } else if (src) {
        setVideoSrc(src);
      }
    };

    fetchVideoUrl();
  }, [bucket, keyName, file, src]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        console.log('Video can play');
        setIsLoaded(true);
      };
      const handleError = (e) => {
        console.error('Video error:', e);
        setError('Error loading video');
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  const playVideo = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
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
      } else if (video.webkitRequestFullscreen) { // iOS Safari
        video.webkitRequestFullscreen();
      } else if (video.webkitEnterFullscreen) { // iOS Safari
        video.webkitEnterFullscreen();
      } else if (video.msRequestFullscreen) { // IE11
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

  return (
    <Card className="overflow-hidden relative h-full" ref={containerRef}>
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
              className={`${isFullscreen ? '' : 'w-full h-full object-cover'}`}
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
              onClick={isFullscreen ? undefined : pauseVideo}
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
        )}
      </div>
    </Card>
  );
};

export default VideoCard;
