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
    <Card className="overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold">{title}</h2>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative h-[500px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Carousel image ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
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
      </CardContent>
    </Card>
  );
};

export default ImageCarouselCard;