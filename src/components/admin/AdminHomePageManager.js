import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Input from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';
import ImageBlock from '../blocks/ImageBlock';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";


const AdminHomePageManager = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`);
      setCarouselImages(response.data);
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    }
  };

  const handleVideoUpload = async (useTimestamp = false) => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('useTimestamp', useTimestamp.toString());

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/homepage/homepagevideo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video uploaded successfully');
      console.log('Upload response:', response.data);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchCarouselImages();
      setNewImage(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const handleImageDelete = async (imageId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images/${imageId}`);
      fetchCarouselImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleDeleteAllImages = async () => {
    if (window.confirm('Are you sure you want to delete all carousel images?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`);
        fetchCarouselImages();
      } catch (error) {
        console.error('Error deleting all images:', error);
        alert('Error deleting all images');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Home Page</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mantra of the Week Video</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            accept="video/*" 
            onChange={(e) => setVideoFile(e.target.files[0])} 
          />
          <Button onClick={() => handleVideoUpload(true)} className="mt-2">Upload Video with Timestamp</Button>
          <Button onClick={handleVideoUpload} className="mt-2">Upload Video</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carousel Images</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setNewImage(e.target.files[0])} 
          />
          <Button onClick={handleImageUpload} className="mt-2">Upload Image</Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {carouselImages.map((image) => (
              <div key={image._id} className="relative">
                <ImageBlock
                  src={image.url || `data:${image.contentType};base64,${arrayBufferToBase64(image.data.data)}`}
                  alt="Carousel Image"
                  className="w-full h-auto"
                />
                <Button 
                  onClick={() => handleImageDelete(image._id)} 
                  className="absolute top-2 right-2" 
                  variant="destructive"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

export default AdminHomePageManager;
