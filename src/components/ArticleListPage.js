import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { ChevronRight } from 'lucide-react';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/articles`);
        setArticles(response.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles. Please try again later.');
      }
    };

    fetchArticles();
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return ''; // Return empty string if text is null or undefined
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Articles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card key={article._id} className="overflow-hidden rounded-lg flex flex-col h-[400px]">
            <div className="relative h-2/3 cursor-pointer">
              <img 
                src={article.mainImage} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h2 className="text-2xl font-bold mb-1">{article.title}</h2>
                <p className="text-sm">By {article.author}</p>
              </div>
            </div>
            <CardContent className="flex-grow flex flex-col justify-center pt-4 px-4">
              <p className="text-gray-600">
                {truncateText(article.tagline || article.content[0].content, 100)}...
                <Link to={`/article/${article._id}`}>
                  <ChevronRight className="inline ml-1 cursor-pointer" />
                </Link>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default ArticleListPage;