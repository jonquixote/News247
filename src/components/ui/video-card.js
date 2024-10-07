import React, { useState, useRef, useEffect } from 'react';
import { Card } from './card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoCard = ({ title, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video) {
      video.addEventListener('loadedmetadata', () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // Draw the first frame of the video onto the canvas
        video.currentTime = 0; // Go to the first frame
      });

      video.addEventListener('error', (e) => {
        console.error("Video error:", e);
        setError("Error loading video. Please check the video source.");
      });

      video.addEventListener('seeked', () => {
        // Draw the current frame on the canvas when seeked
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('error', () => {});
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
            <canvas ref={canvasRef} className="w-full h-full object-cover" style={{ display: isPlaying ? 'none' : 'block' }} />
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              preload="auto" // Preload the video to show the first frame
              style={{ display: isPlaying ? 'block' : 'none' }} // Hide video when not playing
            >
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <button
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition-all"
                onClick={togglePlay}
              >
                <Play className="h-12 w-12" />
              </button>
            )}
            {isPlaying && (
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