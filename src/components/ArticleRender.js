import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoCard from './ui/video-card';

const ArticleRenderer = ({ article }) => {
  const renderBlock = (block) => {
    console.log("Rendering block:", block); // Debugging log
    switch (block.type) {
      case 'text':
        return <TextBlock key={block.id} content={block.content} />;
      case 'image':
        return <ImageBlock key={block.id} src={block.content} alt={block.alt || "Article image"} caption={block.caption} isFullPage={false} />;
      case 'video':
        console.log("Rendering video block:", block);
        return block.content ? (
          <VideoCard key={block.id} title={block.title || "Video"} videoSrc={block.content} />
        ) : (
          <div key={block.id}>No video content available</div>
        );
      case 'tweet':
        return (
          <div key={block.id} className="flex justify-center my-4">
            <div style={{ maxWidth: '500px', width: '100%' }}>
              <TwitterTweetEmbed tweetId={block.content} options={{ width: '100%' }} />
            </div>
          </div>
        );
      default:
        console.log("Unknown block type:", block.type);
        return null;
    }
  };

  return (
    <div className="article-content w-full">
      {article.mainImage && (
        <div className="-mx-6 -mt-6 mb-6">
          <img src={article.mainImage} alt={article.title} className="w-full h-2/5 object-cover mb-4" />
        </div>
      )}
      <div className="space-y-6 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{article.title}</h1>
        {article.tagline && (
          <p className="text-lg sm:text-xl text-gray-600 mb-4">{article.tagline}</p>
        )}
        <p className="text-sm sm:text-base text-gray-600 mb-4">By {article.author} | {article.date}</p>
        {article.content.map(renderBlock)}
      </div>
    </div>
  );
};

export default ArticleRenderer;