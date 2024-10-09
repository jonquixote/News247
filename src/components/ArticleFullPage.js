import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
import TweetBlock from './blocks/TweetBlock';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";

const ArticleFullPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/articles/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article. Please try again later.');
      }
    };

    fetchArticle();
  }, [id]);

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">{error}</div>;
  }

  if (!article) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return <TextBlock key={index} content={block.content} />;
      case 'image':
        return <ImageBlock key={index} src={block.content} alt={block.caption} caption={block.caption} />;
      case 'video':
        return <VideoBlock key={index} src={block.content} title={block.caption} />;
      case 'tweet':
        return <TweetBlock key={index} tweetId={block.content} />;
      default:
        return null;
    }
  };

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
          {article.content.map((block, index) => renderBlock(block, index))}
        </div>
      </div>
    </div>
  );
};

export default ArticleFullPage;