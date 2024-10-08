import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import newsArticles from '../data/NewsArticles';
import VideoCard from './ui/video-card';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const ArticlePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const article = newsArticles.find((article) => article.id === parseInt(id));
  
    if (!article) {
      return <div>Article not found</div>;
    }

    // Adjust this value based on the height of your navigation bar
    const navHeight = 20; // Example height of the navigation bar in pixels

    return (
        <div className="p-0 m-0 h-screen w-screen overflow-auto">
            {article.content !== "Video" && (
                <img src={article.image} alt={article.title} className="w-full h-2/5 object-cover mb-4" />
            )}
            {article.content === "Video" ? (
                <div className="flex flex-col items-center">
                    {/* Leave whitespace for the navigation bar */}
                    <div style={{ height: `${navHeight}px` }}></div>
                    <div className="flex items-center justify-center w-full h-[calc(100vh-${navHeight}px)] px-6">
                        <VideoCard 
                            title={article.title} 
                            videoSrc={article.video} 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="px-8">
                    <p className="text-sm text-center text-gray-400 mb-2">By {article.author} | {article.date}</p>
                    <h2 className="text-5xl text-center font-semibold mb-2">{article.title}</h2>
                    <p className="text-gray-600 text-center text-xl font-semibold mb-2">{article.tagline}</p>
                    <p className="text-gray-600 mb-4 max-w-[800px] mx-auto">{article.content}</p>
                    
                    {/* Render tweets if available */}
                    {article.tweetIds && article.tweetIds.length > 0 && (
                        <div className="my-8">
                            <h3 className="text-2xl font-semibold mb-4">Related Tweets</h3>
                            {article.tweetIds.map((tweetId) => (
                                <div key={tweetId} align="center" className="mb-4">
                                    <TwitterTweetEmbed tweetId={tweetId} />
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ArticlePage;