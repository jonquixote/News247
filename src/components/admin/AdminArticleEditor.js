import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import ArticleRenderer from '../ArticleRender';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Input from '../ui/input';
import Switch from '../ui/switch';
import { GripVertical, X } from 'lucide-react';
import axios from 'axios';
import VideoCard from '../ui/video-card';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary';

const BlockTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  TWEET: 'tweet'
};

const AdminArticleEditor = () => {
  const { id } = useParams(); // Will be undefined when creating a new article
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    tagline: '',
    mainImage: '',
    author: '',
    content: [],
    isMainFeatured: false,
  });

  const [publishStatus, setPublishStatus] = useState('idle'); // 'idle', 'publishing', 'published'
  const [isDragDropEnabled, setIsDragDropEnabled] = useState(false);
  const [isDragDropMounted, setIsDragDropMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [newBlockType, setNewBlockType] = useState(null);
  const [newBlockContent, setNewBlockContent] = useState(null);
  const [newBlockPreview, setNewBlockPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      // Fetch the existing article for editing
      const fetchArticle = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/articles/${id}`);
          setArticle(response.data);
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      };

      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => setIsDragDropMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Short delay to ensure the component is fully mounted
    const timer = setTimeout(() => setIsDragDropEnabled(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const addBlock = (type) => {
    const newBlock = { id: `block-${Date.now()}`, type, content: '' };
    setArticle(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBlockContent({
          name: file.name,
          type: file.type,
          data: reader.result // This will be the base64 data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const extractTweetId = (input) => {
    if (!input) return '';
    
    // Check if the input is already a tweet ID (a string of numbers)
    if (/^\d+$/.test(input)) {
      return input;
    }

    // Try to extract the ID from different Twitter/X URL formats
    const patterns = [
      /(?:twitter|x)\.com\/\w+\/status\/(\d+)/,
      /(?:twitter|x)\.com\/statuses\/(\d+)/,
      /(?:twitter|x)\.com\/\w+\/tweets\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1];
      }
    }

    console.warn('Could not extract tweet ID from:', input);
    return input; // Return the original input if we can't extract an ID
  };

  const submitNewBlock = () => {
    if (newBlockContent) {
      let content = newBlockContent;
      if (newBlockType === 'tweet') {
        content = extractTweetId(content);
      } else if (newBlockType === 'image' || newBlockType === 'video') {
        content = {
          name: newBlockContent.name,
          type: newBlockContent.type,
          data: newBlockContent.data
        };
      }
      const newBlock = {
        id: `block-${Date.now()}`,
        type: newBlockType,
        content: content,
      };
      setArticle(prev => ({
        ...prev,
        content: [...prev.content, newBlock],
      }));
      setNewBlockType(null);
      setNewBlockContent(null);
    }
  };

  const updateBlock = (id, updates) => {
    setArticle(prev => ({
      ...prev,
      content: prev.content.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    }));
  };

  const deleteBlock = (indexToDelete) => {
    setArticle(prevArticle => ({
      ...prevArticle,
      content: prevArticle.content.filter((_, index) => index !== indexToDelete)
    }));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(article.content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArticle(prev => ({...prev, content: items}));
  };

  const handleFileUpload = (id, event, isMainImage = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMainImage) {
          setArticle(prev => ({ ...prev, mainImage: reader.result }));
        } else {
          const fileType = file.type.split('/')[0];
          const content = {
            name: file.name,
            type: file.type,
            data: reader.result
          };
          if (fileType === 'video') {
            const videoUrl = URL.createObjectURL(file);
            updateBlock(id, { content, file, videoUrl });
          } else {
            updateBlock(id, { content });
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event, blockId) => {
    const file = event.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setArticle(prev => ({
        ...prev,
        content: prev.content.map(block =>
          block.id === blockId
            ? { ...block, content: localUrl, file: file, videoBucket: null, videoKey: null }
            : block
        )
      }));
    }
  };

  const renderBlockContent = (block) => {
    switch (block.type) {
      case BlockTypes.TEXT:
        return (
          <textarea
            value={block.content || ''}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Enter text content"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        );
      case BlockTypes.IMAGE:
        return (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(block.id, e)}
              className="mb-2"
            />
            {block.content && block.content.data && (
              <img src={block.content.data} alt="Uploaded content" className="max-w-full h-auto mb-2" />
            )}
            <Input
              type="text"
              value={block.caption || ''}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="Image caption (optional)"
              className="w-full mt-2"
            />
          </div>
        );
      case BlockTypes.VIDEO:
        return (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(block.id, e)}
              className="mb-2"
            />
            {block.videoUrl && (
              <VideoCard title={block.title || "Video Preview"} videoSrc={block.videoUrl} />
            )}
            <Input
              type="text"
              value={block.title || ''}
              onChange={(e) => updateBlock(block.id, { title: e.target.value })}
              placeholder="Video title (optional)"
              className="w-full mt-2"
            />
          </div>
        );
      case BlockTypes.TWEET:
        return (
          <div>
            <Input
              type="text"
              value={block.content}
              onChange={(e) => {
                const tweetId = extractTweetId(e.target.value);
                updateBlock(block.id, { content: tweetId });
              }}
              placeholder="Enter Tweet ID or URL"
              className="w-full"
            />
            {block.content && (
              <div className="text-sm text-gray-500 mt-1">
                Extracted Tweet ID: {block.content}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const uploadVideoToS3 = async (file) => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/uploadvideo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.bucket && response.data.key) {
        return {
          bucket: response.data.bucket,
          key: response.data.key
        };
      } else {
        console.error('Unexpected response format:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  };

  const handleIsMainFeaturedChange = (checked) => {
    setArticle(prev => ({ ...prev, isMainFeatured: checked }));
  };

  const saveArticle = async (status) => {
    if (status === 'published') {
      setPublishStatus('publishing');
    }
    
    if (!article.title.trim()) {
      console.error('Title is required');
      setPublishStatus('idle');
      // Show an error message to the user
      return;
    }

    try {
      // Process content before saving
      const processedContent = await Promise.all(article.content.map(async (block) => {
        if (block.type === 'video' && block.content && block.content.data) {
          // Convert base64 to Blob
          const byteCharacters = atob(block.content.data.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: block.content.type });
          
          // Create a File object
          const file = new File([blob], block.content.name, { type: block.content.type });
          
          const videoData = await uploadVideoToS3(file);
          if (videoData) {
            return {
              type: block.type,
              content: '', // Set content to empty string for videos
              videoBucket: videoData.bucket,
              videoKey: videoData.key,
              title: block.title || ''
            };
          }
          return null; // If upload fails, remove this block
        } else if (block.type === 'image') {
          return {
            type: block.type,
            content: block.content.data, // This should be the base64 string
            caption: block.caption || ''
          };
        } else if (block.type === 'text') {
          return {
            type: block.type,
            content: block.content
          };
        } else if (block.type === 'tweet') {
            const tweetId = extractTweetId(block.content);
            return {
              type: block.type,
              content: tweetId,
              tweetId: tweetId
            };
        }
        return null; // Remove any unrecognized block types
      }));

      // Filter out any null values (failed uploads or unrecognized types)
      const filteredContent = processedContent.filter(block => block !== null);

      const articleToSave = {
        ...article,
        content: filteredContent,
        status
      };

      let response;
      if (id) {
        response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/articles/${id}`, articleToSave);
        console.log('Article updated:', response.data);
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/api/articles`, articleToSave);
        console.log('Article created:', response.data);
      }

      if (status === 'published') {
        setPublishStatus('published');
        setTimeout(() => {
          navigate(`/articles/${response.data._id}`);
        }, 3000);
      } else {
        navigate('/admin/articles');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      if (error.response) {
        console.error('Server responded with:', error.response.data);
      }
      setPublishStatus('idle');
      // Handle error (e.g., show error message to user)
    }
  };

  const renderInputField = () => {
    switch (newBlockType) {
      case 'text':
        return (
          <textarea
            value={newBlockContent || ''}
            onChange={(e) => setNewBlockContent(e.target.value)}
            placeholder="Enter your text here"
            className="w-full p-2 border rounded"
          />
        );
      case 'image':
      case 'video':
        return (
          <>
            <input
              type="file"
              accept={newBlockType === 'image' ? 'image/*' : 'video/*'}
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full p-2 border rounded"
            />
            {newBlockPreview && (
              <div className="mt-2">
                {newBlockType === 'image' ? (
                  <img src={newBlockPreview} alt="Preview" className="max-w-full h-auto" />
                ) : (
                  <video src={newBlockPreview} controls className="max-w-full h-auto" />
                )}
              </div>
            )}
          </>
        );
      case 'tweet':
        return (
          <div>
            <input
              type="text"
              value={newBlockContent || ''}
              onChange={(e) => {
                const tweetId = extractTweetId(e.target.value);
                setNewBlockContent(tweetId);
              }}
              placeholder="Enter tweet URL or ID"
              className="w-full p-2 border rounded"
            />
            {newBlockContent && (
              <div className="text-sm text-gray-500 mt-1">
                Extracted Tweet ID: {newBlockContent}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const handleBlockChange = (index, field, value) => {
    setArticle(prev => {
      const newContent = [...prev.content];
      newContent[index] = { ...newContent[index], [field]: value };
      return { ...prev, content: newContent };
    });
  };

  console.log('Rendering AdminArticleEditor', article);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="admin-article-editor w-full max-w-[1400px] mx-auto p-4 sm:p-6">
        <div className="lg:flex lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="lg:w-1/2 w-full">
            <Card>
              <CardHeader>
                <CardTitle>Create New Article</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2">Main Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(null, e, true)}
                      className="mb-2"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Input
                      type="text"
                      value={article.title}
                      onChange={(e) => setArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Article Title"
                      className="w-full sm:w-1/2"
                    />
                    <Input
                      type="text"
                      value={article.tagline}
                      onChange={(e) => setArticle(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Article Tagline"
                      className="w-full sm:w-1/2"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <Input
                      type="text"
                      value={article.author}
                      onChange={(e) => setArticle(prev => ({ ...prev, author: e.target.value }))}
                      placeholder="Author"
                      className="w-full w-full sm:w-1/2"
                    />
                    <div className="flex items-center w-full sm:w-1/2">
                      <Switch
                        id="main-featured"
                        checked={article.isMainFeatured}
                        onCheckedChange={handleIsMainFeaturedChange}
                      />
                      <label htmlFor="main-featured" className='px-2'>Main Featured Article</label>
                    </div>
                  </div>

                  <ErrorBoundary>
                    {isDragDropEnabled ? (
                      <Droppable droppableId="article-blocks">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="min-h-[100px] border border-gray-300 p-4 rounded bg-gray-100"
                          >
                            {article.content.map((block, index) => {
                              console.log('Rendering block:', block.id, index);
                              return (
                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="bg-white border border-gray-200 p-4 mb-2 rounded shadow-sm flex items-center"
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mr-3 text-gray-400 hover:text-gray-600 cursor-move"
                                      >
                                        ⋮⋮
                                      </div>
                                      <div className="flex-grow">
                                        {[renderBlockContent(block)]} {/* Wrap in an array */}
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ) : (
                      <div>Loading drag and drop functionality...</div>
                    )}
                  </ErrorBoundary>

                  <div className="mb-4">
                    <button onClick={() => addBlock('text')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Add Text</button>
                    <button onClick={() => addBlock('image')} className="mr-2 px-4 py-2 bg-green-500 text-white rounded">Add Image</button>
                    <button onClick={() => addBlock('video')} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">Add Video</button>
                    <button onClick={() => addBlock('tweet')} className="mr-2 px-4 py-2 bg-purple-500 text-white rounded">Add Tweet</button>
                  </div>
                  {newBlockType && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">Add New {newBlockType.charAt(0).toUpperCase() + newBlockType.slice(1)}</h3>
                      {renderInputField()}
                      <button onClick={submitNewBlock} className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded">Add Block</button>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 mt-6">
                    <Button onClick={() => saveArticle('draft')} variant="outline" className="w-full">Save Draft</Button>
                    <Button 
                      onClick={() => saveArticle('published')}
                      variant={'outline'}
                      className={`w-full ${publishStatus === 'publishing' ? 'animate-spin' : ''} ${publishStatus === 'published' ? 'bg-green-500' : ''}`}
                      disabled={publishStatus !== 'idle'}
                    >
                      {publishStatus === 'idle' && 'Publish Article'}
                      {publishStatus === 'publishing' && '🌐'}
                      {publishStatus === 'published' && 'Published!'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-1/2 w-full">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ArticleRenderer blocks={article.content} />
              </CardContent>
            </Card>
          </div>
        </div>
        <button onClick={() => console.log(article)}>Log Article</button>
      </div>
    </DragDropContext>
  );
};

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {type: mimeString});
}

export default AdminArticleEditor;