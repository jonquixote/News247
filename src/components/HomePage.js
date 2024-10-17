import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent } from './ui/card';
import { ChevronRight } from 'lucide-react';
import ImageCarouselCard from './ui/imagecarouselcard';
import VideoCard from './ui/video-card';

const ShimmerLoader = () => (
  <div className="animate-pulse bg-gray-200 h-full w-full absolute inset-0"></div>
);

const FeaturedCardLoader = () => (
  <Card className="h-full w-full overflow-hidden rounded-lg relative">
    <ShimmerLoader />
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
      <div className="h-8 sm:h-12 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  </Card>
);

const StackedCardLoader = () => (
  <Card className="h-full w-full flex flex-col overflow-hidden">
    {[1, 2, 3].map((index) => (
      <div key={index} className="flex-1 border-b border-gray-200 last:border-b-0 relative">
        <ShimmerLoader />
        <div className="flex h-full relative z-10">
          <div className="w-1/3 bg-gray-300"></div>
          <div className="w-2/3 p-2 flex flex-col justify-center">
            <div className="h-3 sm:h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-2 sm:h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </Card>
);

const VideoCardLoader = () => (
  <Card className="h-full w-full overflow-hidden rounded-lg relative">
    <ShimmerLoader />
    <div className="absolute top-0 left-0 right-0 p-2 bg-black bg-opacity-20">
      <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded-full flex items-center justify-center">
        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-gray-400 border-b-8 border-b-transparent ml-1"></div>
      </div>
    </div>
  </Card>
);

const ImageCarouselLoader = () => (
  <Card className="h-full w-full overflow-hidden rounded-lg relative">
    <ShimmerLoader />
    <div className="absolute top-0 left-0 right-0 p-2 bg-black bg-opacity-20">
      <div className="h-3 sm:h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
    <div className="absolute inset-y-0 left-0 flex items-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full ml-2"></div>
    </div>
    <div className="absolute inset-y-0 right-0 flex items-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full mr-2"></div>
    </div>
  </Card>
);

const HomePage = () => {
  const navigate = useNavigate();
  const [mainFeaturedArticle, setMainFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [videoSrc, setVideoSrc] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);
  const mainCardRef = useRef(null);
  const stackedCardRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mainFeaturedResponse, recentArticlesResponse, videoResponse, carouselResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/articles/featured/main`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/articles?limit=6`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/homepage/homepagevideo`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`)
        ]);
        
        setMainFeaturedArticle(mainFeaturedResponse.data);
        setRecentArticles(recentArticlesResponse.data);
        
        if (videoResponse.data.videoBucket && videoResponse.data.videoKey) {
          const urlResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
            bucket: videoResponse.data.videoBucket,
            key: videoResponse.data.videoKey
          });
          if (urlResponse.data && urlResponse.data.url) {
            setVideoSrc(urlResponse.data.url);
          }
        }
        
        const processedImages = carouselResponse.data.map(img => 
          `data:${img.contentType};base64,${arrayBufferToBase64(img.data.data)}`
        );
        console.log('Processed carousel images:', processedImages);
        setCarouselImages(processedImages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      if (mainCardRef.current && stackedCardRef.current) {
        stackedCardRef.current.style.height = `${mainCardRef.current.offsetHeight}px`;
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);

    return () => window.removeEventListener('resize', adjustHeight);
  }, [isLoading]);

  const navigateToArticle = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const stackedFeaturedArticles = recentArticles
    .filter(article => article._id !== mainFeaturedArticle?._id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Featured Articles Section */}
      <section className="my-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[400px] md:h-[300px] lg:h-[400px]">
            {isLoading ? (
              <FeaturedCardLoader />
            ) : mainFeaturedArticle ? (
              <Card className="h-full overflow-hidden rounded-lg relative cursor-pointer" onClick={() => navigateToArticle(mainFeaturedArticle._id)}>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white z-10">
                  <h2 className="text-5xl xs:text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold mb-2">{mainFeaturedArticle.title}</h2>
                  <p className="text-xs lg:text-sm xl:text-sm mb-2">{mainFeaturedArticle.tagline}</p>
                </div>
                <img 
                  src={mainFeaturedArticle.mainImage} 
                  alt={mainFeaturedArticle.title} 
                  className="w-full h-full object-cover"
                />
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <p>No main featured article available</p>
              </Card>
            )}
          </div>
          <div className="h-[400px] md:h-[300px] lg:h-[400px]">
            {isLoading ? (
              <StackedCardLoader />
            ) : (
              <Card className="h-full flex flex-col overflow-hidden">
                {stackedFeaturedArticles.length > 0 ? (
                  stackedFeaturedArticles.map((article) => (
                    <div 
                      key={article._id} 
                      className="flex-1 overflow-hidden cursor-pointer border-b border-gray-200 last:border-b-0"
                      onClick={() => navigateToArticle(article._id)}
                    >
                      <div className="flex h-full">
                        <div className="w-1/3">
                          <img 
                            src={article.mainImage} 
                            alt={article.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-2 flex flex-col justify-center">
                          <h3 className="text-sm font-semibold mb-1 line-clamp-2">{article.title}</h3>
                          <p className="text-xs text-gray-500">By {article.author}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p>No recent articles available</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Home Page Memes Section */}
      <section className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-[400px] md:h-[300px] lg:h-[400px]">
            {isLoading ? (
              <VideoCardLoader />
            ) : (
              <VideoCard
                title="Mantra Of The Week"
                src={videoSrc}
              />
            )}
          </div>
          <div className="md:col-span-2 h-[400px] md:h-[300px] lg:h-[400px]">
            {isLoading ? (
              <ImageCarouselLoader />
            ) : (
              <ImageCarouselCard
                title="Memes of the Day"
                images={carouselImages}
              />
            )}
          </div>
        </div>
      </section>

      {/* Remaining Articles Section
      <section className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">More News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsArticles.slice(4).map((item) => (
            <Card key={item.id} className="overflow-hidden rounded-lg flex flex-col h-[400px]">
              <div className="relative h-2/3 cursor-pointer" onClick={() => navigateToArticle(item.id)}>
                {item.content === "Video" ? (
                  <VideoCard
                    title={item.title}
                    videoSrc={item.video}
                  />
                ) : (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                  <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
                  <p className="text-sm">By {item.author}</p>
                </div>
              </div>
              <CardContent className="flex-grow flex flex-col justify-center pt-4 px-4">
                {item.content === "Video" ? (
                  <p className="text-gray-600">Click to watch the video about {item.title}</p>
                ) : (
                  <p className="text-gray-600">
                    {item.content.substring(0, 200)}...
                    <ChevronRight 
                      className="inline ml-1 cursor-pointer" 
                      onClick={() => navigateToArticle(item.id)}
                    />
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section> */}
    </div>
  );
};

const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default HomePage;
