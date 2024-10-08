import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { ChevronRight } from 'lucide-react';
import ImageCarouselCard from './ui/imagecarouselcard';
import VideoCard from './ui/video-card';

// Import your images and videos here
import newsImage1 from '../media/newsImage1.png';
import newsImage2 from '../media/newsImage2.jpg';
import newsImage3 from '../media/newsImage3.jpg';
import newsImage4 from '../media/newsImage4.jpg';
import newsImage5 from '../media/newsImage5.jpg';
import newsImage6 from '../media/newsImage6.jpg';
import newsVideo1 from '../media/video1.mp4';
import newsVideo2 from '../media/video2.mp4';
import newsVideo3 from '../media/video3.MP4';
import newsVideo4 from '../media/video4.mp4';
import newsVideo5 from '../media/video5.mp4';
import carousel1 from '../media/Carousel/carousel1.JPG';
import carousel2 from '../media/Carousel/carousel2.JPG';
import carousel3 from '../media/Carousel/carousel3.JPG';
import carousel4 from '../media/Carousel/carousel4.JPG';
import carousel5 from '../media/Carousel/carousel5.JPG';
import carousel6 from '../media/Carousel/carousel6.JPG';
import carousel7 from '../media/Carousel/carousel7.JPG';
import carousel8 from '../media/Carousel/carousel8.JPG';

const newsArticles = [
    { 
      id: 1,
      title: "The Problem with AI",
      tagline: "Exploring the limitations of artificial intelligence",
      content: "Artificial intelligence is both exciting and concerning. We hope it will solve our problems, but fear it may be based on a flawed understanding of how humans think and use language. Programs like ChatGPT are impressive, generating human-like text from massive datasets. However, they are far from achieving true intelligence. These programs rely on statistical pattern matching, fundamentally different from human reasoning. This limits their capabilities and creates inherent flaws. Unlike humans, who form explanations and understand cause and effect, these programs simply describe and predict.\n\n\nA young child effortlessly learns complex grammar from minimal data, demonstrating an innate understanding of language structure.  Machine learning programs lack this innate ability, relying instead on brute-force memorization. Critically, they cannot grasp counterfactuals – statements about what is not the case and what could be. True intelligence lies in explaining why things happen, not just predicting what will happen.  Imagine observing a falling apple.  'The apple falls' is a description. The apple will fall if I let go' is a prediction. But true understanding is explaining why it falls, invoking gravity or the curvature of spacetime. Machine learning programs also struggle with moral reasoning. They either overgenerate (producing both ethical and unethical outputs) or undergenerate (remaining indifferent to moral considerations). This is because they cannot reason from ethical principles. ChatGPT exhibits a kind of 'banality of evil':  plagiarism, apathy, and the avoidance of responsibility.  It summarizes existing arguments without taking a stand, pleading not ignorance, but a lack of intelligence.  Ultimately, it offers a 'just following orders' defense, shifting responsibility to its creators. This reveals the difficulty in balancing creativity with ethical constraints in machine learning.  These programs either produce both truths and falsehoods, endorsing ethical and unethical decisions alike, or they remain noncommittal and indifferent. While machine learning has its uses, it falls short of true intelligence.  Its limitations in understanding language, explaining causality, and reasoning morally raise concerns about its potential impact on science and ethics.  We must be mindful of these shortcomings and strive for AI that truly reflects human intelligence, capable of both creativity and moral responsibility.",
      author: "Johnny", 
      date: "2024-10-06",
      image: newsImage2
    },
    { 
      id: 2,
      title: "GPT Speaks Jamacian Patois",
      tagline: "",
      content: "Video",
      author: "Johnny", 
      date: "2024-10-05",
      image: newsImage3,
      video: newsVideo3
    },
    { 
      id: 3,
      title: "Hurricane Helene's Trail of Destruction",
      tagline: "Coastal communities grapple with storm's aftermath",
      content: "Hurricane Helene's passage was less a visit and more a hostile takeover, leaving a landscape transformed by wind and water. Coastal towns, once picturesque havens, now bear the scars of the storm's fury.  Houses, once neatly aligned along streets, now occupy precarious positions, some even venturing out for an impromptu swim.  The shoreline, once a gentle curve of sand, has been reshaped, a testament to the raw power of nature. Inland, the rivers, engorged by days of relentless rain,  burst their banks, claiming dominion over fields, roads, and even the occasional unfortunate dwelling.  Bridges, those reliable links between communities, were tested beyond their limits, some succumbing to the overwhelming force of the current.  The wind, not content to be a mere spectator, joined the fray, transforming trees into whimsical sculptures, power lines into abstract webs, and roofs into unexpected ventilation systems. Asheville, nestled in the heart of the Blue Ridge Mountains, found itself unexpectedly grappling with an aquatic adventure.  The French Broad River, usually a picture of tranquility, decided to showcase its more boisterous side, turning the River Arts District into a temporary lagoon and prompting a citywide reassessment of flood insurance policies.  The Biltmore Estate, that bastion of elegance, now offers guests a somewhat dampened experience, though one might argue that the addition of indoor waterfalls adds a certain charm. The federal government's response has been, to put it charitably, measured.  Disaster relief funds seem to be adhering to a strict sightseeing itinerary, FEMA officials appear to be relying on carrier pigeons for communication, and politicians are offering 'thoughts and prayers' with the solemnity of someone ordering a pizza.  Promises of aid are trickling in with the speed of continental drift, leaving residents to contemplate the merits of building their own levees. And yet, amidst the chaos and uncertainty, the human spirit endures. Communities rally, neighbors support neighbors, and laughter, that most resilient of human traits, finds a way to bloom even in the most challenging of circumstances.  One can only hope that this resilience will be met with a timely and effective response from those in power, a response that goes beyond mere words and translates into tangible action.  For in the aftermath of a storm, it is not just bricks and mortar that need rebuilding, but also hope, and the assurance that those affected are not alone.'",
      author: "Johnny", 
      date: "2024-10-03",
      image: newsImage1
    },
    { 
      id: 4,
      title: "Quentin Tarantino Has An Epiphany",
      tagline: "",
      content: "Video",
      author: "Johnny", 
      date: "2024-10-04",
      image: newsImage4,
      video: newsVideo2
    },
    { 
      id: 5, 
      title: "The Rise of Vertical Farming",
      tagline: "Urban agriculture reaches new heights",
      content: "Vertical farming is transforming agriculture as we know it. These innovative farms, often housed in repurposed urban buildings, are capable of producing fresh produce year-round, regardless of outdoor conditions. By using hydroponic or aeroponic systems, vertical farms can grow crops with 70% less water than traditional farming methods. They also significantly reduce the need for pesticides and eliminate the carbon footprint associated with transporting produce over long distances.\n\n...",
      author: "Johnny", 
      date: "2024-10-01",
      image: newsImage5
    },
    { 
      id: 6, 
      title: "Breakthroughs in Quantum Computing",
      tagline: "Unlocking unprecedented computational power",
      content: "Quantum computing is on the brink of a major breakthrough. Recent advancements have allowed researchers to create quantum processors with over 100 qubits, bringing us closer to quantum supremacy - the point at which quantum computers can solve problems that classical computers practically cannot. These powerful machines have the potential to revolutionize fields such as cryptography, drug discovery, and complex system modeling.\n\n...",
      author: "Dr. Johnny", 
      date: "2024-10-01",
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

const HomePage = () => {
  const navigate = useNavigate();

  const navigateToArticle = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const mainFeaturedArticle = newsArticles[0];
  const stackedFeaturedArticles = newsArticles.slice(1, 4);

  return (
    <main className="flex-grow container mx-auto px-4 py-4">
      {/* Featured Articles Section */}
      <section className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <Card className="h-full overflow-hidden rounded-lg relative cursor-pointer" onClick={() => navigateToArticle(mainFeaturedArticle.id)}>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white z-10">
                <h2 className="text-5xl xs:text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-bold mb-2">{mainFeaturedArticle.title}</h2>
                <p className="text-xs lg:text-sm xl:text-sm mb-2">{mainFeaturedArticle.tagline}</p>
              </div>
              <img 
                src={mainFeaturedArticle.image} 
                alt={mainFeaturedArticle.title} 
                className="w-full h-full object-cover"
              />
            </Card>
          </div>
          {/* Stacked Featured Articles Section */}
          <Card className="h-[300px] md:h-auto flex flex-col overflow-hidden">
            {stackedFeaturedArticles.map((article) => (
              <div 
                key={article.id} 
                className="flex-1 overflow-hidden cursor-pointer border-b border-gray-200 last:border-b-0"
                onClick={() => navigateToArticle(article.id)}
              >
                <div className="flex h-full">
                  <div className="w-1/3">
                    <img 
                      src={article.image} 
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
            ))}
          </Card>
        </div>
      </section>

      {/* Home Page Memes Section */}
      <section className="my-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-[400px]"> {/* Fixed height */}
            <VideoCard
              title="Mantra Of The Week"
              videoSrc={newsVideo4}
            />
          </div>
          <div className="md:col-span-2 h-[400px]"> {/* Fixed height */}
            <ImageCarouselCard
              title="Memes of the Day"
              images={carouselImages}
            />
          </div>
        </div>
      </section>

      {/* Remaining Articles Section */}
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
      </section>
    </main>
  );
};

export default HomePage;