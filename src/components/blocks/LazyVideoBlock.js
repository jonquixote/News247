import React from 'react';
import { useInView } from 'react-intersection-observer';
import VideoBlock from './VideoBlock';

const LazyVideoBlock = ({ src, title, poster, blockId }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  console.log('LazyVideoBlock received props:', { src, title, poster, blockId });

  return (
    <div ref={ref}>
      {inView ? (
        <VideoBlock src={src} title={title} poster={poster} blockId={blockId} />
      ) : (
        <div style={{ height: '56.25vw', maxHeight: '400px', backgroundColor: '#000' }} />
      )}
    </div>
  );
};

export default LazyVideoBlock;