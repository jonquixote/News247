import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import LazyVideoBlock from './blocks/LazyVideoBlock'; // Updated import
import { TwitterTweetEmbed } from 'react-twitter-embed';
import VideoLoader from './ui/VideoLoader';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";

const ArticleFullPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/articles/${id}`);
        console.log('Article data:', response.data);
        // Log video blocks specifically
        const videoBlocks = response.data.content.filter(block => block.type === 'video');
        console.log('Video blocks:', videoBlocks);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const renderBlock = useCallback((block) => {
    console.log('Rendering block:', block);
    switch (block.type) {
      case 'text':
        return <TextBlock key={block.id} content={block.content} />;
      case 'image':
        return (
          <ImageBlock
            key={block.id}
            src={block.content}
            alt={block.alt}
            caption={block.caption}
            isFullPage={true}
          />
        );
      case 'video':
        return (
          <LazyVideoBlock
            key={block.id}
            src={block.content}
            title={block.title || block.caption}
            poster={block.poster}
            blockId={block.id}
          />
        );
      case 'tweet':
        return (
          <div key={block.id} className="flex justify-center my-4">
            <div style={{ maxWidth: '400px', width: '100%' }}>
              <TwitterTweetEmbed
                tweetId={block.content}
                options={{ width: '100%' }}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  }, []);

  const memoizedContent = useMemo(() => {
    if (!article) return null;
    return article.content.map(renderBlock);
  }, [article, renderBlock]);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!article) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {article.mainImage && (
        <div className="w-screen h-[40vh] overflow-hidden">
          <img 
            src={article.mainImage} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-grow px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto w-full">
        <p className="text-sm text-center text-gray-400 mb-2">
          By {article.author} | {new Date(article.date).toLocaleDateString()}
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center font-semibold mb-2">
          {article.title}
        </h1>
        {article.tagline && (
          <p className="text-gray-600 text-center text-lg sm:text-xl font-semibold mb-6">
            {article.tagline}
          </p>
        )}
        <div className="prose prose-lg mx-auto">
          {memoizedContent}
        </div>
      </div>
    </div>
  );
};

export default ArticleFullPage;