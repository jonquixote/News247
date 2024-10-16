import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import Input from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import axios from 'axios';
import ImageBlock from '../blocks/ImageBlock';
import { Progress } from '../ui/progress';
import VideoCard from '../ui/video-card';

const REACT_APP_API_URL = "https://news-backend-delta.vercel.app";


const AdminHomePageManager = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [carouselImages, setCarouselImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    fetchCarouselImages();
    fetchCurrentVideo();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`);
      setCarouselImages(response.data);
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    }
  };

  const fetchCurrentVideo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/homepage/homepagevideo`);
      setCurrentVideo(response.data);
      
      if (response.data.videoBucket && response.data.videoKey) {
        try {
          const urlResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/getVideoUrl`, {
            bucket: response.data.videoBucket,
            key: response.data.videoKey
          });
          
          if (urlResponse.data && urlResponse.data.url) {
            setVideoSrc(urlResponse.data.url);
          } else {
            console.error('Failed to generate video URL');
          }
        } catch (err) {
          console.error('Error fetching video URL:', err);
        }
      } else if (response.data.videoUrl) {
        setVideoSrc(response.data.videoUrl);
      } else {
        console.error('No valid video source found in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching current video:', error);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleVideoUpload = async (useTimestamp = false) => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('useTimestamp', useTimestamp.toString());

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/homepage/homepagevideo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setVideoUploadProgress(percentCompleted);
        }
      });
      alert('Video uploaded successfully');
      setVideoFile(null);
      setVideoUploadProgress(0);
      fetchCurrentVideo(); // Fetch the updated video information
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error uploading video');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!newImage) return;

    const formData = new FormData();
    formData.append('image', newImage);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/homepage/carousel-images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageUploadProgress(percentCompleted);
        }
      });
      fetchCarouselImages();
      setNewImage(null);
      setImagePreviewUrl(null);
      setImageUploadProgress(0);
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
          <CardTitle>Home Page Video</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            type="file" 
            accept="video/*" 
            onChange={handleVideoChange}
          />
          <Button 
            onClick={() => handleVideoUpload(false)} 
            className="mt-4 mr-2" 
            disabled={!videoFile || videoUploadProgress > 0}
          >
            {videoUploadProgress > 0 ? `Uploading... ${videoUploadProgress}%` : 'Upload Video (Replace)'}
          </Button>
          {/* <Button 
            onClick={() => handleVideoUpload(true)} 
            className="mt-4"
            disabled={!videoFile || videoUploadProgress > 0}
          >
            {videoUploadProgress > 0 ? `Uploading... ${videoUploadProgress}%` : 'Upload Video (New)'}
          </Button> */}
          {videoUploadProgress > 0 && (
            <Progress value={videoUploadProgress} className="mt-2" />
          )}
          {videoFile && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Video Preview:</h3>
              <VideoCard
                title=""
                file={videoFile}
              />
            </div>
          )}
          {videoSrc && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Current Video:</h3>
              <VideoCard
                title=""
                src={videoSrc}
              />
            </div>
          )}
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
            onChange={handleImageChange}
          />
          <Button onClick={handleImageUpload} className="mt-4" disabled={!newImage || imageUploadProgress > 0}>
            {imageUploadProgress > 0 ? `Uploading... ${imageUploadProgress}%` : 'Upload Image'}
          </Button>
          {imageUploadProgress > 0 && (
            <Progress value={imageUploadProgress} className="mt-2" />
          )}
          {imagePreviewUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview:</h3>
              <ImageBlock
                src={imagePreviewUrl}
                alt="Image Preview"
                className="w-full max-w-md h-auto"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
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
