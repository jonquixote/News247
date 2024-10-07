import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, Menu, ChevronRight } from 'lucide-react';
import ImageCarouselCard from './components/ui/imagecarouselcard';
import VideoCard from './components/ui/video-card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './styles/globals.css'
import newsImage1 from './media/newsImage1.png';
import newsImage2 from './media/newsImage2.jpg';
import newsImage3 from './media/newsImage3.jpeg';
import newsImage4 from './media/newsImage4.jpg';
import newsImage5 from './media/newsImage5.jpg';
import newsImage6 from './media/newsImage6.jpg';
import newsVideo1 from './media/video1.mp4';
import newsVideo2 from './media/video2.mp4';
import newsVideo3 from './media/video3.MP4';
import carousel1 from './media/Carousel/carousel1.JPG';
import carousel2 from './media/Carousel/carousel2.JPG';
import carousel3 from './media/Carousel/carousel3.JPG';
import carousel4 from './media/Carousel/carousel4.JPG';
import carousel5 from './media/Carousel/carousel5.JPG';
import carousel6 from './media/Carousel/carousel6.JPG';
import carousel7 from './media/Carousel/carousel7.JPG';
import carousel8 from './media/Carousel/carousel8.JPG';

const newsArticles = [
  { 
    id: 1,
    title: "The Problem with AI",
    tagline: "Exploring the limitations of artificial intelligence",
    content: "Artificial intelligence is both exciting and concerning. We hope it will solve our problems, but fear it may be based on a flawed understanding of how humans think and use language. Programs like ChatGPT are impressive, generating human-like text from massive datasets. However, they are far from achieving true intelligence. These programs rely on statistical pattern matching, fundamentally different from human reasoning. This limits their capabilities and creates inherent flaws. Unlike humans, who form explanations and understand cause and effect, these programs simply describe and predict.\n\n\nA young child effortlessly learns complex grammar from minimal data, demonstrating an innate understanding of language structure.  Machine learning programs lack this innate ability, relying instead on brute-force memorization. Critically, they cannot grasp counterfactuals – statements about what is not the case and what could be. True intelligence lies in explaining why things happen, not just predicting what will happen.  Imagine observing a falling apple.  'The apple falls' is a description. The apple will fall if I let go' is a prediction. But true understanding is explaining why it falls, invoking gravity or the curvature of spacetime. Machine learning programs also struggle with moral reasoning. They either overgenerate (producing both ethical and unethical outputs) or undergenerate (remaining indifferent to moral considerations). This is because they cannot reason from ethical principles. ChatGPT exhibits a kind of 'banality of evil':  plagiarism, apathy, and the avoidance of responsibility.  It summarizes existing arguments without taking a stand, pleading not ignorance, but a lack of intelligence.  Ultimately, it offers a 'just following orders' defense, shifting responsibility to its creators. This reveals the difficulty in balancing creativity with ethical constraints in machine learning.  These programs either produce both truths and falsehoods, endorsing ethical and unethical decisions alike, or they remain noncommittal and indifferent. While machine learning has its uses, it falls short of true intelligence.  Its limitations in understanding language, explaining causality, and reasoning morally raise concerns about its potential impact on science and ethics.  We must be mindful of these shortcomings and strive for AI that truly reflects human intelligence, capable of both creativity and moral responsibility.",
    author: "Johnny", 
    date: "2024-10-04",
    image: newsImage2
  },
  { 
    id: 2, 
    title: "Hurricane Helene Leaves Trail of Destruction",
    tagline: "Coastal communities grapple with storm's aftermath",
    content: "Hurricane Helene's passage was less a visit and more a hostile takeover, leaving a landscape transformed by wind and water. Coastal towns, once picturesque havens, now bear the scars of the storm's fury.  Houses, once neatly aligned along streets, now occupy precarious positions, some even venturing out for an impromptu swim.  The shoreline, once a gentle curve of sand, has been reshaped, a testament to the raw power of nature. Inland, the rivers, engorged by days of relentless rain,  burst their banks, claiming dominion over fields, roads, and even the occasional unfortunate dwelling.  Bridges, those reliable links between communities, were tested beyond their limits, some succumbing to the overwhelming force of the current.  The wind, not content to be a mere spectator, joined the fray, transforming trees into whimsical sculptures, power lines into abstract webs, and roofs into unexpected ventilation systems. Asheville, nestled in the heart of the Blue Ridge Mountains, found itself unexpectedly grappling with an aquatic adventure.  The French Broad River, usually a picture of tranquility, decided to showcase its more boisterous side, turning the River Arts District into a temporary lagoon and prompting a citywide reassessment of flood insurance policies.  The Biltmore Estate, that bastion of elegance, now offers guests a somewhat dampened experience, though one might argue that the addition of indoor waterfalls adds a certain charm. The federal government's response has been, to put it charitably, measured.  Disaster relief funds seem to be adhering to a strict sightseeing itinerary, FEMA officials appear to be relying on carrier pigeons for communication, and politicians are offering 'thoughts and prayers' with the solemnity of someone ordering a pizza.  Promises of aid are trickling in with the speed of continental drift, leaving residents to contemplate the merits of building their own levees. And yet, amidst the chaos and uncertainty, the human spirit endures. Communities rally, neighbors support neighbors, and laughter, that most resilient of human traits, finds a way to bloom even in the most challenging of circumstances.  One can only hope that this resilience will be met with a timely and effective response from those in power, a response that goes beyond mere words and translates into tangible action.  For in the aftermath of a storm, it is not just bricks and mortar that need rebuilding, but also hope, and the assurance that those affected are not alone.'",
    author: "Johnny", 
    date: "2024-10-04",
    image: newsImage1
  },
  { 
    id: 3, 
    title: "Global Climate Summit Begins",
    tagline: "World leaders gather to address climate crisis",
    content: "World leaders gather to discuss urgent climate action at the annual Global Climate Summit. The week-long event will focus on strategies to reduce carbon emissions, promote renewable energy, and mitigate the impacts of climate change. Experts hope this summit will lead to concrete commitments and actionable plans.\n\nThe summit, held virtually due to ongoing pandemic concerns, brings together heads of state, climate scientists, and environmental activists from over 190 countries. Key topics on the agenda include accelerating the transition to clean energy, protecting biodiversity, and financing climate adaptation in developing nations.\n\nUN Secretary-General António Guterres opened the summit with a stark warning: 'We are at a crucial crossroads. The decisions we make today will shape the future of our planet for generations to come. We must act now, and we must act together.'",
    author: "Johnny", 
    date: "2024-10-02",
    image: newsImage3
  },
  { 
    id: 4,
    title: "The Future of Renewable Energy",
    tagline: "Innovations reshaping our sustainable future",
    content: "The renewable energy sector is experiencing a revolution. From advanced solar panels that can generate electricity even on cloudy days to wind turbines that can harness energy from the slightest breeze, the innovations are remarkable. Scientists are also making strides in energy storage, developing new battery technologies that can store surplus energy for use during peak demand periods. Moreover, tidal and geothermal energy are becoming increasingly viable options, expanding our renewable energy portfolio.\n\n...",
    author: "Dr. Johnny", 
    date: "2024-10-05",
    image: newsImage4
  },
  { 
    id: 5, 
    title: "The Rise of Vertical Farming",
    tagline: "Urban agriculture reaches new heights",
    content: "Vertical farming is transforming agriculture as we know it. These innovative farms, often housed in repurposed urban buildings, are capable of producing fresh produce year-round, regardless of outdoor conditions. By using hydroponic or aeroponic systems, vertical farms can grow crops with 70% less water than traditional farming methods. They also significantly reduce the need for pesticides and eliminate the carbon footprint associated with transporting produce over long distances.\n\n...",
    author: "Johnny", 
    date: "2024-10-06",
    image: newsImage5
  },
  { 
    id: 6, 
    title: "Breakthroughs in Quantum Computing",
    tagline: "Unlocking unprecedented computational power",
    content: "Quantum computing is on the brink of a major breakthrough. Recent advancements have allowed researchers to create quantum processors with over 100 qubits, bringing us closer to quantum supremacy - the point at which quantum computers can solve problems that classical computers practically cannot. These powerful machines have the potential to revolutionize fields such as cryptography, drug discovery, and complex system modeling.\n\n...",
    author: "Dr. Johnny", 
    date: "2024-10-07",
    image: newsImage6
  },
];

const carouselImages = [
  carousel1,
  carousel3,
  carousel4,
  carousel5,
  carousel6,
  carousel7,
  carousel8,
  carousel2,
];

const NewsApp = () => {
  const [news, setNews] = useState(newsArticles);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const closeArticleOnOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      closeArticle();
    }
  };

  const featuredArticles = newsArticles.slice(0, 3);
  const remainingArticles = newsArticles.slice(3);


  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">APM News</h1>
            </div>
            <div className="flex items-center">
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1 [&>svg]:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#FFFFFF] bg-opacity-3 backdrop-blur-sm">
                  <DropdownMenuItem>Home</DropdownMenuItem>
                  <DropdownMenuItem>Categories</DropdownMenuItem>
                  <DropdownMenuItem>About</DropdownMenuItem>
                  <DropdownMenuItem>Contact</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Featured Articles Section */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="h-full overflow-hidden rounded-lg relative cursor-pointer" onClick={() => openArticle(featuredArticles[0])}>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white z-10">
                  <h2 className="text-7xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold mb-2">{featuredArticles[0].title}</h2>
                  <p className="text-xs lg:text-sm xl:text-sm mb-2">{featuredArticles[0].tagline}</p>
                  <p className="text-xs">By {featuredArticles[0].author}</p>
                </div>
                <img 
                  src={featuredArticles[0].image} 
                  alt={featuredArticles[0].title} 
                  className="w-full h-full object-cover"
                />
              </Card>
            </div>
            <div className="space-y-6">
              {featuredArticles.slice(1, 3).map((article) => (
                <Card key={article.id} className="h-[calc(50%-0.75rem)] overflow-hidden rounded-lg relative cursor-pointer" onClick={() => openArticle(article)}>
                  <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent text-white z-10 w-full">
                    <h3 className="text-4xl xs:text-3xl sm:text-4xl md:text-lg lg:text-3xl xl:text-4xl md:text-base font-semibold mb-1">{article.title}</h3>
                    <p className="text-xs">{article.tagline}</p>
                  </div>
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </Card>
              ))}
            </div>
          </div>
        </section>


        {/* Home Page Memes Section */}
        <section className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-[400px]"> {/* Fixed height */}
              <ImageCarouselCard
                title="Memes of the Day"
                images={carouselImages}
              />
            </div>
            <div className="h-[400px]"> {/* Fixed height */}
              <VideoCard
                title="GPT Speaks Jamaican Patois"
                videoSrc={newsVideo3}
              />
            </div>
          </div>
        </section>

        {/* Remaining Articles Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">More News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remainingArticles.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-lg flex flex-col h-[400px]">
                <div className="relative h-2/3 cursor-pointer" onClick={() => openArticle(item)}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                    <h2 className="text-2xl font-bold mb-1">{item.title}</h2>
                    <p className="text-sm">By {item.author}</p>
                  </div>
                </div>
                <CardContent className="flex-grow flex flex-col justify-center pt-4 px-4">
                  <p className="text-gray-600">
                    {item.content.substring(0, 200)}...
                    <ChevronRight 
                      className="inline ml-1 cursor-pointer" 
                      onClick={() => openArticle(item)}
                    />
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Article Modal */}
        {selectedArticle && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeArticleOnOutsideClick}
          >
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold mb-2">{selectedArticle.title}</h2>
              <p className="text-sm text-gray-500 mb-4">By {selectedArticle.author} | {selectedArticle.date}</p>
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-[300px] object-cover mb-4 rounded-lg"
              />
              <p className="text-gray-600 mb-4">{selectedArticle.content}</p>
              <Button onClick={closeArticle}>Close</Button>
            </div>
          </div>
        )}

        <br></br>
        <VideoCard 
            title="Video Of The Day" 
            videoSrc={newsVideo2}
          />
        <br></br>
        <ImageCarouselCard title="Memes Of The Day" images={carouselImages} />
        <br></br>
        <VideoCard 
            title="GPT Speaks Jamaican Patois" 
            videoSrc={newsVideo3}
          />
      </main>
    </div>
  );
};

export default NewsApp;