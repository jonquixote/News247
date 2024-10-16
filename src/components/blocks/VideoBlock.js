import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../ui/card';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

const VideoBlock = ({ src, title, bucket, keyName, file, isFullPage = false }) => {
  console.log('VideoBlock props:', { src, title, bucket, keyName, file });
  
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadVideo = async () => {
      if (src) {
        if (src.startsWith('blob:')) {
          console.log('Using blob URL:', src);
          setVideoUrl(src);
          setIsLoaded(true);
        } else if (src.startsWith('http') || src.startsWith('https')) {
          console.log('Using direct URL:', src);
          setVideoUrl(src);
          setIsLoaded(true);
        } else {
          console.log('Using local file path:', src);
          setVideoUrl(src);
          setIsLoaded(true);
        }
      } else if (file) {
        console.log('Using File object:', file);
        const fileUrl = URL.createObjectURL(file);
        setVideoUrl(fileUrl);
        setIsLoaded(true);
      } else if (bucket && keyName) {
        console.log('Fetching S3 video URL');
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
            bucket,
            key: keyName
          });
          
          if (response.data && response.data.url) {
            console.log('Received S3 URL:', response.data.url);
            setVideoUrl(response.data.url);
            setIsLoaded(true);
          } else {
            console.error('Failed to generate video URL');
            setError('Failed to generate video URL.');
          }
        } catch (err) {
          console.error('Error generating video URL:', err);
          setError('Failed to load video. Please try again later.');
        }
      } else {
        console.error('No video source provided');
        setError('No video source provided.');
      }
    };

    loadVideo();

    return () => {
      if (videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [src, bucket, keyName, file]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleError = (e) => {
        console.error("Video error:", e);
        setError("Error loading video. Please check the video source.");
        setIsLoaded(false);
      };
      const handleLoaded = () => {
        console.log("Video loaded successfully");
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
  }, [videoUrl]);

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
        ) : videoUrl ? (
          <>
            <video
              ref={videoRef}
              className={`w-full h-auto ${isFullscreen ? '' : 'object-cover'}`}
              src={videoUrl}
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onLoadedMetadata={() => {
                videoRef.current.currentTime = 0;
                setIsLoaded(true);
              }}
              style={isLoaded ? { display: 'block', maxWidth: '500px', maxHeight: '500px' } : { display: 'none' }}
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
