import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Dialog } from '@headlessui/react';

const ImageBlock = ({ src, alt, caption, isFullPage = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-center">
        <Card className="inline-block overflow-hidden">
          <img 
            src={src} 
            alt={alt || caption || "Article image"} 
            className="cursor-pointer"
            style={isFullPage ? { 
              maxWidth: '500px', 
              maxHeight: '500px', 
              width: '100%', 
              height: 'auto', 
              objectFit: 'contain' 
            } : {}}
            onClick={() => setIsOpen(true)}
          />
          {caption && <p className="text-center text-sm text-gray-600 p-2">{caption}</p>}
        </Card>
      </div>
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