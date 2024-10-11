import React from 'react';
import VideoBlock from './blocks/VideoBlock';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import TweetBlock from './blocks/TweetBlock';  // Import the TweetBlock component
import { Card } from './ui/card';
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
      console.log('Video block data:', block);
      if (!block.content) {
        return <LoadingBlock key={`video-loading-${block.id || index}`} type="video" />;
      }
      return (
        <VideoBlock
          key={`video-${block.id || index}`}
          src={typeof block.content === 'object' ? block.content.data : block.content}
          title={block.title}
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