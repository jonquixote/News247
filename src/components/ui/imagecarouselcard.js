import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './card';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarouselCard = ({ title, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="flex-shrink-0">
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="p-0 relative flex-grow">
        <div className="relative w-full h-full bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={images[currentImageIndex]}
              alt={`Carousel image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <Button
            variant="ghost"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={prevImage}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
            onClick={nextImage}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageCarouselCard;