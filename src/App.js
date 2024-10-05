import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './components/ui/card';
import { Button } from './components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import ImageCarouselCard from './components/ui/imagecarouselcard';
import VideoCard from './components/ui/video-card';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './styles/globals.css'
import newsImage1 from './media/newsImage1.png';
import newsImage2 from './media/newsImage2.jpg';
import newsImage3 from './media/newsImage3.jpeg';
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

const dummyNews = [
  { 
    id: 1,
    title: "The Problem with AI", 
    content: "Artificial intelligence is both exciting and concerning.  We hope it will solve our problems, but fear it may be based on a flawed understanding of how humans think and use language.  Programs like ChatGPT are impressive, generating human-like text from massive datasets.  However, they are far from achieving true intelligence. These programs rely on statistical pattern matching, fundamentally different from human reasoning.  This limits their capabilities and creates inherent flaws.  Unlike humans, who form explanations and understand cause and effect, these programs simply describe and predict.\n\n\nA young child effortlessly learns complex grammar from minimal data, demonstrating an innate understanding of language structure.  Machine learning programs lack this innate ability, relying instead on brute-force memorization. Critically, they cannot grasp counterfactuals – statements about what is not the case and what could be. True intelligence lies in explaining why things happen, not just predicting what will happen.  Imagine observing a falling apple.  'The apple falls' is a description. The apple will fall if I let go' is a prediction. But true understanding is explaining why it falls, invoking gravity or the curvature of spacetime. Machine learning programs also struggle with moral reasoning. They either overgenerate (producing both ethical and unethical outputs) or undergenerate (remaining indifferent to moral considerations). This is because they cannot reason from ethical principles. ChatGPT exhibits a kind of 'banality of evil':  plagiarism, apathy, and the avoidance of responsibility.  It summarizes existing arguments without taking a stand, pleading not ignorance, but a lack of intelligence.  Ultimately, it offers a 'just following orders' defense, shifting responsibility to its creators. This reveals the difficulty in balancing creativity with ethical constraints in machine learning.  These programs either produce both truths and falsehoods, endorsing ethical and unethical decisions alike, or they remain noncommittal and indifferent. While machine learning has its uses, it falls short of true intelligence.  Its limitations in understanding language, explaining causality, and reasoning morally raise concerns about its potential impact on science and ethics.  We must be mindful of these shortcomings and strive for AI that truly reflects human intelligence, capable of both creativity and moral responsibility.",
    author: "Johnny", 
    date: "2024-10-04",
    image: newsImage2
  },
  { 
    id: 2, 
    title: "Hurricane Helene Leaves Trail of Destruction", 
    content: "Hurricane Helene's passage was less a visit and more a hostile takeover, leaving a landscape transformed by wind and water. Coastal towns, once picturesque havens, now bear the scars of the storm's fury.  Houses, once neatly aligned along streets, now occupy precarious positions, some even venturing out for an impromptu swim.  The shoreline, once a gentle curve of sand, has been reshaped, a testament to the raw power of nature. Inland, the rivers, engorged by days of relentless rain,  burst their banks, claiming dominion over fields, roads, and even the occasional unfortunate dwelling.  Bridges, those reliable links between communities, were tested beyond their limits, some succumbing to the overwhelming force of the current.  The wind, not content to be a mere spectator, joined the fray, transforming trees into whimsical sculptures, power lines into abstract webs, and roofs into unexpected ventilation systems. Asheville, nestled in the heart of the Blue Ridge Mountains, found itself unexpectedly grappling with an aquatic adventure.  The French Broad River, usually a picture of tranquility, decided to showcase its more boisterous side, turning the River Arts District into a temporary lagoon and prompting a citywide reassessment of flood insurance policies.  The Biltmore Estate, that bastion of elegance, now offers guests a somewhat dampened experience, though one might argue that the addition of indoor waterfalls adds a certain charm. The federal government's response has been, to put it charitably, measured.  Disaster relief funds seem to be adhering to a strict sightseeing itinerary, FEMA officials appear to be relying on carrier pigeons for communication, and politicians are offering 'thoughts and prayers' with the solemnity of someone ordering a pizza.  Promises of aid are trickling in with the speed of continental drift, leaving residents to contemplate the merits of building their own levees. And yet, amidst the chaos and uncertainty, the human spirit endures. Communities rally, neighbors support neighbors, and laughter, that most resilient of human traits, finds a way to bloom even in the most challenging of circumstances.  One can only hope that this resilience will be met with a timely and effective response from those in power, a response that goes beyond mere words and translates into tangible action.  For in the aftermath of a storm, it is not just bricks and mortar that need rebuilding, but also hope, and the assurance that those affected are not alone.'",
    author: "Johnny", 
    date: "2024-10-04",
    image: newsImage1
  },
  // { 
  //   id: 3, 
  //   title: "Global Climate Summit Begins", 
  //   content: "World leaders gather to discuss urgent climate action at the annual Global Climate Summit. The week-long event will focus on strategies to reduce carbon emissions, promote renewable energy, and mitigate the impacts of climate change. Experts hope this summit will lead to concrete commitments and actionable plans.\n\nThe summit, held virtually due to ongoing pandemic concerns, brings together heads of state, climate scientists, and environmental activists from over 190 countries. Key topics on the agenda include accelerating the transition to clean energy, protecting biodiversity, and financing climate adaptation in developing nations.\n\nUN Secretary-General António Guterres opened the summit with a stark warning: 'We are at a crucial crossroads. The decisions we make today will shape the future of our planet for generations to come. We must act now, and we must act together.'",
  //   author: "Emma Johnson", 
  //   date: "2024-10-02",
  //   image: newsImage3
  // },
];

const carouselImages = [
  newsVideo1,
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
  const [news, setNews] = useState(dummyNews);
  const [expandedArticle, setExpandedArticle] = useState(null);

  const toggleArticle = (id) => {
    setExpandedArticle(expandedArticle === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-10">
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
      
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dummyNews.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-[150px] object-cover"
              />
              <CardHeader>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">By {item.author} | {item.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {expandedArticle === item.id 
                    ? item.content 
                    : `${item.content.substring(0, 150)}...`}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-gray-50">
                <Button 
                  variant="ghost" 
                  onClick={() => toggleArticle(item.id)}
                  className="flex items-center"
                >
                  {expandedArticle === item.id ? (
                    <>Read Less <ChevronUp className="ml-2 h-4 w-4" /></>
                  ) : (
                    <>Read More <ChevronDown className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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