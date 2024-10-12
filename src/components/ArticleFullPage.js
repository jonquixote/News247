import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextBlock from './blocks/TextBlock';
import ImageBlock from './blocks/ImageBlock';
import VideoBlock from './blocks/VideoBlock';
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
    switch (block.type) {
      case 'text':
        return <TextBlock key={`text-${index}`} content={block.content} />;
      case 'image':
        return (
          <ImageBlock
            key={`image-${index}`}
            src={block.content}
            alt={block.alt}
            caption={block.caption}
            isFullPage={true}
          />
        );
      case 'video':
        return (
          <VideoBlock
            key={`video-${index}`}
            src={block.content}
            bucket={block.videoBucket}
            keyName={block.videoKey}
            title={block.title}
          />
        );
      case 'tweet':
        return (
          <TweetBlock
            key={`tweet-${block._id || index}`}
            tweetId={block.content || block.tweetId} // Use either content or tweetId
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-8">{article.tagline}</p>
      {article.content.map(renderBlock)}
      <button onClick={() => console.log(article)}>Log Article</button>
    </div>
  );
};

export default ArticleFullPage;
