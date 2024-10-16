import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoCard from './ui/video-card';
import TweetBlock from './blocks/TweetBlock';  // Import the TweetBlock component
import { TwitterTweetEmbed } from 'react-twitter-embed';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";

const ArticleFullPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/articles/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
        setError("Failed to load article.");
      }
    };

    fetchArticle();
  }, [id]);

  const renderBlock = useCallback((block, index) => {
    console.log('Rendering block:', block);
    const wrapBlock = (content) => (
      <div key={`block-${block.id || index}`} className="w-full max-w-[500px] mx-auto">
        {content}
      </div>
    );

    switch (block.type) {
      case 'text':
        return wrapBlock(<TextBlock content={block.content} />);
      case 'image':
        return wrapBlock(
          <ImageBlock
            src={block.content}
            alt={block.alt}
            caption={block.caption}
            isFullPage={true}
          />
        );
      case 'video':
        return wrapBlock(
          <div className="flex justify-center">
            <VideoCard 
              title={block.title}
              src={block.content}
              bucket={block.videoBucket}
              keyName={block.videoKey}
            />
          </div>
        );
      case 'tweet':
        return wrapBlock(
          <TweetBlock
            tweetId={block.content || block.tweetId}
          />
        );
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      {article.mainImage && (
        <div className="w-full h-[40vh] overflow-hidden">
          <img 
            src={article.mainImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="article-content w-full max-w-[500px] px-4 py-4 sm:px-6 lg:px-8 space-y-0">
        <h1 className="text-4xl font-bold text-center mb-2">{article.title}</h1>
        <p className="text-gray-600 text-center max-w-[400px] mx-auto mb-2">
          {article.tagline}
        </p>
        {article.content.map(renderBlock)}
      </div>
    </div>
  );
};

export default ArticleFullPage;
