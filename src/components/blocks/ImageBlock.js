import React from 'react';
import { Card } from '../ui/card';

const ImageBlock = ({ src, alt, caption }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto"
        />
        {caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
            <p className="text-sm">{caption}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageBlock;