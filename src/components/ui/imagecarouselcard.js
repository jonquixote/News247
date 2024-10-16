import React, { useState } from 'react';
import { Card } from './card'; // Adjust the import based on your structure
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import arrow icons
import { useSwipeable } from 'react-swipeable';

const ImageCarouselCard = ({ title, images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Card className="overflow-hidden rounded-lg relative h-full" {...handlers}> {/* Ensure full height */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-black bg-opacity-20 text-white z-10"> {/* More translucent background */}
        <h2 className="text-sm font-bold">{title}</h2> {/* Reduced header size to half */}
      </div>
      <div className="relative bg-gray-900 h-full"> {/* Set height to full */}
        <div className="flex items-center justify-between h-full"> {/* Ensure full height for flex container */}
          <button onClick={prevImage} className="absolute left-0 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex overflow-hidden h-full w-full"> {/* Ensure overflow container takes full height */}
            <div className="flex-shrink-0 w-full h-full flex items-center justify-center"> {/* Full height for image container */}
              {images && images.length > 0 ? (
                <img 
                  src={images[currentIndex]} 
                  alt={`Carousel image ${currentIndex + 1}`} 
                  className="max-w-full max-h-full w-auto h-auto object-contain" 
                  onError={(e) => {
                    console.error('Error loading image:', images[currentIndex]);
                    e.target.src = 'path/to/fallback/image.jpg'; // Replace with a fallback image
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No images available
                </div>
              )}
            </div>
          </div>
          <button onClick={nextImage} className="absolute right-0 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75">
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ImageCarouselCard;
