import React from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';

const ArticleRenderer = ({ article }) => {
  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return <TextBlock key={block.id} content={block.content} />;
      case 'image':
        return <ImageBlock key={block.id} src={block.content} alt={block.alt || "Article image"} caption={block.caption} />;
      case 'video':
        console.log("Rendering video block:", block); // Debugging log
        return <VideoBlock key={block.id} src={block.content} title={block.title} />;
      case 'tweet':
        return (
          <div key={block.id} align="center" className="mb-4">
            <TwitterTweetEmbed tweetId={block.content} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="article-content w-full">
      {article.mainImage && (
        <div className="-mx-6 -mt-6 mb-6">
          <img src={article.mainImage} alt="Main article image" className="w-full h-auto object-cover" />
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