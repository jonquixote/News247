import React, { useState, useEffect } from 'react';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import TweetBlock from './blocks/TweetBlock';
import { Card } from './ui/card';
import VideoCard from './ui/video-card';
import axios from 'axios';

const LoadingBlock = ({ type }) => (
  <Card className="overflow-hidden relative mb-4">
    <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">Waiting for {type} source...</span>
    </div>
  </Card>
);

const BlockRenderer = ({ block, index }) => {
  const [videoSrc, setVideoSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (block.type !== 'video') {
        setIsLoading(false);
        return;
      }

      console.log('Fetching video URL for block:', block);
      setIsLoading(true);
      setVideoSrc(''); // Reset videoSrc at the start of each fetch

      if (block.videoBucket && block.videoKey) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
            bucket: block.videoBucket,
            key: block.videoKey
          });
          
          if (response.data && response.data.url) {
            console.log('Received S3 URL:', response.data.url);
            setVideoSrc(response.data.url);
          } else {
            console.error('Failed to generate video URL');
          }
        } catch (err) {
          console.error('Error fetching video URL:', err);
        }
      } else if (block.videoUrl) {
        console.log('Using provided videoUrl:', block.videoUrl);
        setVideoSrc(block.videoUrl);
      } else if (typeof block.content === 'string' && block.content.startsWith('blob:')) {
        console.log('Using blob URL as video source:', block.content);
        setVideoSrc(block.content);
      } else if (block.content && typeof block.content === 'object' && block.content.data) {
        console.log('Using content.data as video source');
        setVideoSrc(block.content.data);
      } else if (typeof block.content === 'string') {
        console.log('Using content as video source');
        setVideoSrc(block.content);
      } else {
        console.error('No valid video source found in block:', block);
      }

      setIsLoading(false);
    };

    fetchVideoUrl();
  }, [block]);

  console.log(`Rendering block ${index}:`, block);

  switch (block.type) {
    case 'text':
      return <TextBlock key={`text-${block.id || index}`} content={block.content} />;
    case 'image':
      console.log('Image block data:', block);
      if (!block.content) {
        return <LoadingBlock key={`image-loading-${block.id || index}`} type="image" />;
      }
      return (
        <div className="flex flex-col items-center">
          <ImageBlock
            key={`image-${block.id || index}`}
            src={typeof block.content === 'object' && block.content.data ? block.content.data : block.content}
            alt={block.alt || 'Image'}
            caption={block.caption}
          />
          {block.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {block.caption}
            </p>
          )}
        </div>
      );
    case 'video':
      console.log('Video block data:', block);
      if (isLoading) {
        return <LoadingBlock key={`video-loading-${block.id || index}`} type="video" />;
      }
      if (!videoSrc) {
        console.error('No video source available for block:', block);
        return <div>Error: No video source available</div>;
      }
      return (
        <VideoCard 
          key={`video-${block.id || index}`}
          title={block.title || "Video"}
          src={videoSrc}
          bucket={block.videoBucket}
          keyName={block.videoKey}
        />
      );
    case 'tweet':
      console.log('Tweet block data:', block);
      if (!block.content) {
        console.error('Tweet block is missing content:', block);
        return <LoadingBlock key={`tweet-error-${block._id || index}`} type="tweet" />;
      }
      return (
        <TweetBlock
          key={`tweet-${block._id || index}`}
          tweetId={block.content}
        />
      );
    default:
      console.warn(`Unknown block type: ${block.type}`);
      return null;
  }
};

const ArticleRenderer = ({ blocks }) => {
  const [processedBlocks, setProcessedBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processBlocks = async () => {
      if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
        setIsLoading(false);
        return;
      }

      const processed = await Promise.all(blocks.map(async (block) => {
        if (block.type === 'video' && block.videoBucket && block.videoKey) {
          try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
              bucket: block.videoBucket,
              key: block.videoKey
            });
            
            if (response.data && response.data.url) {
              console.log('Received S3 URL:', response.data.url);
              return { ...block, videoSrc: response.data.url };
            }
          } catch (err) {
            console.error('Error fetching video URL:', err);
          }
        }
        return block;
      }));

      setProcessedBlocks(processed);
      setIsLoading(false);
    };

    processBlocks();
  }, [blocks]);

  if (isLoading) {
    return <div>Loading article content...</div>;
  }

  if (processedBlocks.length === 0) {
    return <div className="article-content">No content available</div>;
  }

  return (
    <div className="article-content w-full max-w-full px-2 sm:px-2 lg:px-2 space-y-0 overflow-x-hidden">
      {processedBlocks.map((block, index) => (
        <BlockRenderer key={block.id || `block-${index}`} block={block} index={index} />
      ))}
    </div>
  );
};

export default ArticleRenderer;
