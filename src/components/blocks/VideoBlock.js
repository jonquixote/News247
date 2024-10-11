import React, { useState, useEffect, useRef } from 'react';
import Plyr from 'plyr-react';
import 'plyr-react/plyr.css';
import VideoLoader from '../ui/VideoLoader';

const VideoBlock = ({ src, title, poster, blockId }) => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

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
      { rootMargin: '200px' }
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

  useEffect(() => {
    if (isVisible && videoRef.current) {
      const videoElement = videoRef.current;

      const handleLoadedData = () => {
        console.log('Video loaded');
        setIsLoaded(true);
        setError(null);
      };

      const handleError = (e) => {
        console.error('Video error:', e);
        setError('Error loading video');
        setIsLoaded(true);
      };

      videoElement.addEventListener('loadeddata', handleLoadedData);
      videoElement.addEventListener('error', handleError);

      return () => {
        videoElement.removeEventListener('loadeddata', handleLoadedData);
        videoElement.removeEventListener('error', handleError);
      };
    }
  }, [isVisible]);

  console.log('VideoBlock props:', { src, title, poster, blockId });

  const plyrProps = {
    source: {
      type: 'video',
      sources: [{ src, type: 'video/mp4' }],
    },
    options: {
      controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      poster: poster,
    },
  };

  return (
    <div className="relative w-full" ref={containerRef} style={{ aspectRatio: '16/9' }}>
      {title && (
        <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 z-10">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
      )}
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-center justify-center h-full" role="alert">
          <strong className="font-bold mr-2">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : isVisible ? (
        <>
          <Plyr {...plyrProps}>
            <video ref={videoRef} poster={poster}>
              <source src={src} type="video/mp4" />
            </video>
          </Plyr>
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
      {title && <p className="mt-2 text-center text-gray-600">{title}</p>}
    </div>
  );
};

export default VideoBlock;