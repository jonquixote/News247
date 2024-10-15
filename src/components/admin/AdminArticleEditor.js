import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import ArticleRenderer from '../ArticleRender';
import DragAndDropArticleBlocks from './DragAndDropArticleBlocks';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Input from '../ui/input';
import Switch from '../ui/switch';
import { GripVertical, X } from 'lucide-react';
import axios from 'axios';
import VideoCard from '../ui/video-card';
import { useParams, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary';
import TextBlock from '../blocks/TextBlock';
import ImageBlock from '../blocks/ImageBlock';
import TweetBlock from '../blocks/TweetBlock';

const BlockTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  TWEET: 'tweet'
};

const TextBlockEditor = ({ block, index, handleBlockChange }) => {
  return (
    <div>
      <textarea
        value={block.content}
        onChange={(e) => handleBlockChange(index, 'content', e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <div className="mt-2 p-2 bg-gray-100 rounded">
        <TextBlock content={block.content} />
      </div>
    </div>
  );
};

const ImageBlockEditor = ({ block, index, handleBlockChange }) => {
  const [localImagePreview, setLocalImagePreview] = useState(
    block.content && (typeof block.content === 'object' ? block.content.data : block.content)
  );

  useEffect(() => {
    setLocalImagePreview(block.content && (typeof block.content === 'object' ? block.content.data : block.content));
  }, [block.content]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalImagePreview(reader.result);
        handleBlockChange(index, 'content', { 
          data: reader.result, 
          file: file,  // Store the file object for later upload
          name: file.name, 
          type: file.type 
        });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[350px]">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-2"
        />
        <Input
          type="text"
          value={block.caption || ''}
          onChange={(e) => handleBlockChange(index, 'caption', e.target.value)}
          placeholder="Image caption (optional)"
          className="w-full mt-2 mb-2"
        />
        <Input
          type="text"
          value={block.alt || ''}
          onChange={(e) => handleBlockChange(index, 'alt', e.target.value)}
          placeholder="Alt text (optional)"
          className="w-full mt-2 mb-2"
        />
      </div>
      <div className="w-full max-w-[350px] mt-2">
        {localImagePreview && (
          <ImageBlock
            src={localImagePreview}
            alt={block.alt || 'Image preview'}
            caption={block.caption}
          />
        )}
      </div>
    </div>
  );
};

const VideoBlockEditor = ({ block, index, handleBlockChange }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-[350px]">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const videoUrl = URL.createObjectURL(file);
              handleBlockChange(index, 'content', { data: videoUrl, name: file.name, type: file.type });
              handleBlockChange(index, 'file', file);
              handleBlockChange(index, 'videoUrl', videoUrl);
            }
          }}
          className="w-full p-2 border rounded mb-2"
        />
        <Input
          type="text"
          value={block.title || ''}
          onChange={(e) => handleBlockChange(index, 'title', e.target.value)}
          placeholder="Video title (optional)"
          className="w-full mt-2 mb-2"
        />
      </div>
      <div className="w-full h-full max-w-[350px] max-h-[350px] flex justify-center mt-2">
        <VideoCard 
          title={block.title || "Video Preview"}
          src={block.videoUrl || (block.content && block.content.data) || ''}
          bucket={block.videoBucket}
          keyName={block.videoKey}
          file={block.file}
        />
      </div>
    </div>
  );
};

const TweetBlockEditor = ({ block, index, handleBlockChange }) => {
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
  const handleTweetInput = (e) => {
    const tweetId = extractTweetId(e.target.value);
    handleBlockChange(index, 'content', tweetId);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Input
        type="text"
        value={block.content || ''}
        onChange={handleTweetInput}
        placeholder="Enter Tweet ID or URL"
        className="w-full max-w-[300px] p-2 border rounded mb-2"
      />
      <div className="w-full max-w-[300px] flex justify-center mt-2">
        {block.content && <TweetBlock tweetId={block.content} />}
      </div>
    </div>
  );
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
  const [imagePreview, setImagePreview] = useState(null);
  const [blocks, setBlocks] = useState([]);  // Ensure this is initialized as an empty array

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
    const timer = setTimeout(() => {
      setIsDragDropMounted(true);
      setIsDragDropEnabled(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    console.log('Current article state:', article);
  }, [article]);

  useEffect(() => {
    // This effect runs after the block has been updated
    setImagePreview(null);
  }, [article.content]); // Dependency array includes article.content

  const addBlock = (type) => {
    const newBlock = { 
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      type, 
      content: type === 'video' ? { data: null, name: null, type: null } : ''
    };
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
          data: reader.result
        });
        setNewBlockPreview(reader.result); // Set preview for image/video
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

  const handleBlockChange = (index, field, value) => {
    setArticle(prev => {
      const updatedContent = prev.content.map((block, i) => {
        if (i === index) {
          let updatedBlock = { ...block, [field]: value };
          
          if (block.type === 'image' && field === 'content') {
            // For image blocks, update the content directly
            updatedBlock.content = value;
          } else if (field === 'file') {
            // Handle file uploads for other types (e.g., video)
            const reader = new FileReader();
            reader.onloadend = () => {
              setArticle(prevArticle => ({
                ...prevArticle,
                content: prevArticle.content.map((b, idx) => 
                  idx === index ? { ...b, content: { data: reader.result, name: value.name, type: value.type } } : b
                )
              }));
            };
            reader.readAsDataURL(value);
            updatedBlock = { ...updatedBlock, file: value };
          }
          
          return updatedBlock;
        }
        return block;
      });
      return { ...prev, content: updatedContent };
    });
  };

  const deleteBlock = (indexToDelete) => {
    setArticle(prevArticle => ({
      ...prevArticle,
      content: prevArticle.content.filter((_, index) => index !== indexToDelete)
    }));
  };

  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(article.content);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setArticle(prev => ({ ...prev, content: items }));
  }, [article.content]);

  const handleFileUpload = (id, event, isMainImage = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isMainImage) {
          setArticle(prev => ({ ...prev, mainImage: reader.result }));
        } else {
          const fileType = file.type.split('/')[0];
          if (reader.result) {
            const content = {
              name: file.name,
              type: file.type,
              data: reader.result
            };
            if (fileType === 'video') {
              const videoUrl = URL.createObjectURL(file);
              handleBlockChange(id, { content, file, videoUrl });
            } else {
              handleBlockChange(id, { content });
            }
          } else {
            console.error('Failed to read file');
            handleBlockChange(id, { content: null }); // Reset content if file read fails
          }
        }
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        handleBlockChange(id, { content: null }); // Reset content if error occurs
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
            ? { ...block, videoUrl: localUrl, file: file, videoBucket: null, videoKey: null }
            : block
        )
      }));
    }
  };

  const renderBlockContent = (block, index) => {
    switch (block.type) {
      case 'text':
        return <TextBlockEditor block={block} index={index} handleBlockChange={handleBlockChange} />;
      case 'image':
        return <ImageBlockEditor block={block} index={index} handleBlockChange={handleBlockChange} />;
      case 'video':
        return <VideoBlockEditor block={block} index={index} handleBlockChange={handleBlockChange} />;
      case 'tweet':
        return <TweetBlockEditor block={block} index={index} handleBlockChange={handleBlockChange} />;
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

  // Add this function near your other utility functions in AdminArticleEditor
  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/articles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data && response.data.url) {
        return { url: response.data.url };
      } else {
        console.error('Image upload failed: No URL in response');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
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
        if (block.type === 'video') {
          if (block.file) {
            // This is a new video that needs to be uploaded
            const videoData = await uploadVideoToS3(block.file);
            if (videoData) {
              return {
                type: block.type,
                videoBucket: videoData.bucket,
                videoKey: videoData.key,
                title: block.title || ''
              };
            }
            return null; // If upload fails, remove this block
          } else if (block.videoBucket && block.videoKey) {
            // This is an existing S3 video, keep as is
            return {
              type: block.type,
              videoBucket: block.videoBucket,
              videoKey: block.videoKey,
              title: block.title || ''
            };
          } else if (block.videoUrl) {
            // This is a local video URL that hasn't been uploaded to S3 yet
            // For drafts, we'll keep the local URL. For published, we'll upload to S3.
            if (status === 'published') {
              const response = await fetch(block.videoUrl);
              const blob = await response.blob();
              const file = new File([blob], 'video.mp4', { type: 'video/mp4' });
              const videoData = await uploadVideoToS3(file);
              if (videoData) {
                return {
                  type: block.type,
                  videoBucket: videoData.bucket,
                  videoKey: videoData.key,
                  title: block.title || ''
                };
              }
              return null; // If upload fails, remove this block
            } else {
              // For drafts, keep the local URL
              return {
                type: block.type,
                videoUrl: block.videoUrl,
                title: block.title || ''
              };
            }
          }
        } else if (block.type === 'image') {
          if (block.content && block.content.file) {
            // This is a new or updated image that needs to be uploaded
            const reader = new FileReader();
            const fileDataPromise = new Promise((resolve) => {
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(block.content.file);
            });
            const fileData = await fileDataPromise;
            
            return {
              type: block.type,
              content: fileData,
              caption: block.caption || '',
              alt: block.alt || ''
            };
          } else if (typeof block.content === 'string') {
            // This is an existing image, keep as is
            return block;
          }
          // If we reach here, it means the image wasn't properly processed
          console.error('Image block without proper content:', block);
          return null;
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
                    {isDragDropMounted ? (
                      <DragAndDropArticleBlocks 
                        article={article} 
                        renderBlockContent={(block, index) => renderBlockContent(block, index)}
                        updateBlock={handleBlockChange}
                      />
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
              <div className="flex flex-col">
                {article.mainImage && (
                  <div className="w-screen w-full h-full h-[30vh] overflow-hidden">
                    <img 
                      src={article.mainImage} 
                      alt={article.title}
                      className="object-cover"
                    />
                  </div>
                )}
                </div>
                <div className="flex flex-col justify-center w-full mx-auto px-2 py-2 space-y-0 mb-2">
                <h1 className="text-4xl font-bold article-content text-center py-2">{article.title}</h1>
                <p className="text-gray-600 article-content text-center max-w-[400px] px-12">{article.tagline}</p>
                </div>
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