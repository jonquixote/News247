import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VideoCard = ({ title, videoSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('error', (e) => {
        console.error("Video error:", e);
        setError("Error loading video. Please check the video source.");
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
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        console.log("Video started playing");
      }).catch(error => {
        console.error("Error playing video:", error);
        setError("Error playing video. Please try again.");
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      console.log("Video paused");
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
    console.log("Mute toggled:", videoRef.current.muted);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="p-0 relative">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full"
              src={videoSrc}
              muted={isMuted}
              onClick={togglePlay}
            >
              Your browser does not support the video tag.
            </video>
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <Button 
                  onClick={togglePlay}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Play Video
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-gray-50">
        <Button variant="ghost" onClick={togglePlay}>
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="ghost" onClick={toggleMute}>
          {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;