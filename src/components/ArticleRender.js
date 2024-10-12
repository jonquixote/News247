import React from 'react';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import TweetBlock from './blocks/TweetBlock';
import { Card } from './ui/card';
import VideoCard from './ui/video-card';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const LoadingBlock = ({ type }) => (
  <Card className="overflow-hidden relative mb-4">
    <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">Waiting for {type} source...</span>
    </div>
  </Card>
);

const BlockRenderer = ({ block, index }) => {
  if (!block || typeof block !== 'object') {
    console.warn(`Invalid block at index ${index}:`, block);
    return null;
  }

  console.log(`Rendering block:`, block); // Keep this for debugging

  switch (block.type) {
    case 'text':
      return <TextBlock key={`text-${block.id || index}`} content={block.content} />;
    case 'image':
      console.log('Image block data:', block);
      if (!block.content) {
        return <LoadingBlock key={`image-loading-${block.id || index}`} type="image" />;
      }
      return (
        <ImageBlock
          key={`image-${block.id || index}`}
          src={typeof block.content === 'object' ? block.content.data : block.content}
          alt={block.alt || 'Image'}
          caption={block.caption}
        />
      );
    case 'video':
      console.log('Video block data:', block); // Keep this for debugging
      let videoSrc;
      if (block.videoBucket && block.videoKey) {
        videoSrc = `https://${block.videoBucket}.s3.amazonaws.com/${block.videoKey}`;
      } else if (block.videoUrl) {
        videoSrc = block.videoUrl;
      } else if (block.content && block.content.data) {
        // Assuming content.data is a base64 string for local blob
        videoSrc = block.content.data;
      } else {
        return <LoadingBlock key={`video-loading-${block.id || index}`} type="video" />;
      }
      return (
        <VideoCard 
          key={`video-${block.id || index}`}
          title={block.title || "Video"}
          videoSrc={videoSrc}
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
  console.log('Received blocks:', blocks);

  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    console.warn('ArticleRenderer: blocks prop is invalid or empty');
    return <div className="article-content">No content available</div>;
  }

  return (
    <div className="article-content">
      {blocks.map((block, index) => (
        <BlockRenderer key={block.id || `block-${index}`} block={block} index={index} />
      ))}
    </div>
  );
};

export default ArticleRenderer;
