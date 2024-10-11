import React, { useState, useEffect, useRef } from 'react';
import VideoBlock from './VideoBlock';

const LazyVideoBlock = ({ src, title, poster, blockId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
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

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <VideoBlock src={src} title={title} poster={poster} blockId={blockId} />
      ) : (
        <div className="relative w-full h-0" style={{ paddingBottom: '56.25%' }}>
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Loading video...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyVideoBlock;