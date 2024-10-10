import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/card';
import { Dialog } from '@headlessui/react';

const ImageBlock = ({ src, alt, caption, isFullPage = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imgRef.current) {
        const { naturalWidth, naturalHeight } = imgRef.current;
        let width = naturalWidth;
        let height = naturalHeight;
        
        if (isFullPage && (width > 500 || height > 500)) {
          const aspectRatio = width / height;
          if (width > height) {
            width = 500;
            height = width / aspectRatio;
          } else {
            height = 500;
            width = height * aspectRatio;
          }
        }
        
        setDimensions({ width, height });
      }
    };

    const img = imgRef.current;
    if (img && img.complete) {
      updateDimensions();
    } else if (img) {
      img.onload = updateDimensions;
    }

    return () => {
      if (img) {
        img.onload = null;
      }
    };
  }, [src, isFullPage]);

  return (
    <>
      <div className="flex justify-center">
        <Card className="p-0 overflow-hidden" style={{ width: isFullPage ? `${dimensions.width}px` : 'auto' }}>
          <img 
            ref={imgRef}
            src={src} 
            alt={alt || caption || "Article image"} 
            className="cursor-pointer w-full h-auto"
            style={isFullPage ? { maxWidth: '500px', maxHeight: '500px' } : {}}
            onClick={() => setIsOpen(true)}
          />
        </Card>
      </div>
      {caption && <p className="text-center text-sm text-gray-600 mt-2">{caption}</p>}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-3xl rounded bg-white">
            <img src={src} alt={alt || caption || "Article image"} className="w-full h-auto" />
            {caption && <p className="text-center p-4">{caption}</p>}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-1"
            >
              ✕
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ImageBlock;